<?php

namespace Tests\Feature;

use App\Models\Facility;
use App\Models\GalleryCategory;
use App\Models\GalleryItem;
use App\Models\MediaFile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AdminGalleryEditingTest extends TestCase
{
    use RefreshDatabase;

    public function test_owner_can_update_bilingual_gallery_metadata_without_replacing_image(): void
    {
        $owner = User::factory()->create();
        $category = GalleryCategory::create(['name_tr' => 'Salon', 'name_en' => 'Gym', 'slug' => 'salon']);
        $item = GalleryItem::create([
            'gallery_category_id' => $category->id,
            'image_path' => 'gallery/original.jpg',
            'caption_tr' => 'Eski açıklama',
            'caption_en' => 'Old caption',
            'is_active' => true,
        ]);
        MediaFile::create([
            'disk' => 'public',
            'path' => 'gallery/original.jpg',
            'filename' => 'original.jpg',
            'original_name' => 'original.jpg',
            'mime_type' => 'image/jpeg',
            'size' => 10,
            'alt_tr' => 'Eski alt',
            'alt_en' => 'Old alt',
            'collection' => 'gallery',
        ]);

        $this->actingAs($owner)->post('/admin/gallery/items/'.$item->id, [
            'gallery_category_id' => $category->id,
            'caption_tr' => '  Yeni açıklama  ',
            'caption_en' => 'New caption',
            'alt_tr' => 'Salon ekipmanları',
            'alt_en' => 'Gym equipment',
            'sort_order' => 0,
            'is_active' => true,
        ])->assertRedirect();

        $this->assertDatabaseHas('gallery_items', [
            'id' => $item->id,
            'image_path' => 'gallery/original.jpg',
            'caption_tr' => 'Yeni açıklama',
            'caption_en' => 'New caption',
        ]);
        $this->assertDatabaseHas('media_files', [
            'path' => 'gallery/original.jpg',
            'alt_tr' => 'Salon ekipmanları',
            'alt_en' => 'Gym equipment',
        ]);
    }

    public function test_gallery_edit_validation_rejects_overlong_alt_text(): void
    {
        $owner = User::factory()->create();
        $category = GalleryCategory::create(['name_tr' => 'Salon', 'name_en' => 'Gym', 'slug' => 'salon']);
        $item = GalleryItem::create(['gallery_category_id' => $category->id, 'image_path' => 'gallery/original.jpg', 'is_active' => true]);

        $this->actingAs($owner)->post('/admin/gallery/items/'.$item->id, [
            'gallery_category_id' => $category->id,
            'alt_tr' => str_repeat('x', 256),
            'sort_order' => 0,
            'is_active' => true,
        ])->assertSessionHasErrors('alt_tr');
    }

    public function test_deleting_a_category_keeps_its_images_uncategorized(): void
    {
        $owner = User::factory()->create();
        $category = GalleryCategory::create(['name_tr' => 'Salon', 'name_en' => 'Gym', 'slug' => 'salon']);
        $other = GalleryCategory::create(['name_tr' => 'Ekipman', 'name_en' => 'Equipment', 'slug' => 'ekipman']);
        $item = GalleryItem::create(['gallery_category_id' => $category->id, 'image_path' => 'gallery/used.jpg', 'is_active' => true]);

        $this->actingAs($owner)->put('/admin/gallery/categories/'.$category->id, [
            'name_tr' => 'Yeni salon',
            'name_en' => 'New gym',
            'sort_order' => 1,
        ])->assertRedirect();

        $this->assertDatabaseHas('gallery_categories', [
            'id' => $category->id,
            'name_tr' => 'Yeni salon',
            'name_en' => 'New gym',
        ]);

        $this->actingAs($owner)->post('/admin/gallery/items/'.$item->id, [
            'gallery_category_id' => $other->id,
            'caption_tr' => 'Taşındı',
            'sort_order' => 0,
            'is_active' => true,
        ])->assertRedirect();

        $this->assertDatabaseHas('gallery_items', [
            'id' => $item->id,
            'gallery_category_id' => $other->id,
            'image_path' => 'gallery/used.jpg',
        ]);

        $this->actingAs($owner)->delete('/admin/gallery/categories/'.$other->id)->assertRedirect();

        $this->assertDatabaseMissing('gallery_categories', ['id' => $other->id]);
        $this->assertDatabaseHas('gallery_items', [
            'id' => $item->id,
            'gallery_category_id' => null,
            'image_path' => 'gallery/used.jpg',
        ]);

        $this->get('/galeri')->assertOk()->assertInertia(fn ($page) => $page
            ->component('Public/Gallery/Index')
            ->has('categories', 0)
            ->where('items.0.id', $item->id)
            ->where('items.0.category_slug', null));
    }

    public function test_gallery_filters_show_only_when_images_span_more_than_one_group(): void
    {
        $salon = GalleryCategory::create(['name_tr' => 'Salon', 'name_en' => 'Gym', 'slug' => 'salon', 'sort_order' => 1]);
        $empty = GalleryCategory::create(['name_tr' => 'Boş', 'name_en' => 'Empty', 'slug' => 'bos', 'sort_order' => 2]);
        GalleryItem::create(['gallery_category_id' => $salon->id, 'image_path' => 'gallery/one.jpg', 'is_active' => true]);
        GalleryItem::create(['gallery_category_id' => $salon->id, 'image_path' => 'gallery/two.jpg', 'is_active' => true]);

        $this->get('/galeri')->assertOk()->assertInertia(fn ($page) => $page->has('categories', 0));

        GalleryItem::create(['gallery_category_id' => null, 'image_path' => 'gallery/loose.jpg', 'is_active' => true]);

        $this->get('/galeri')->assertOk()->assertInertia(fn ($page) => $page
            ->has('categories', 1)
            ->where('categories.0.slug', 'salon')
            ->where('categories.0.name', 'Salon'));

        $athletes = GalleryCategory::create(['name_tr' => 'Yarışmacılar', 'name_en' => 'Athletes', 'slug' => 'yarismacilar', 'sort_order' => 3]);
        GalleryItem::create(['gallery_category_id' => $athletes->id, 'image_path' => 'gallery/athlete.jpg', 'is_active' => true]);

        $this->get('/galeri')->assertOk()->assertInertia(fn ($page) => $page
            ->has('categories', 2)
            ->where('categories.0.slug', 'salon')
            ->where('categories.1.slug', 'yarismacilar'));

        $this->assertDatabaseHas('gallery_categories', ['id' => $empty->id]);
    }

    public function test_gallery_delete_preserves_a_shared_image_path(): void
    {
        Storage::fake('public');
        Storage::disk('public')->put('gallery/shared.jpg', 'image');
        $owner = User::factory()->create();
        $category = GalleryCategory::create(['name_tr' => 'Salon', 'name_en' => 'Gym', 'slug' => 'salon']);
        $item = GalleryItem::create(['gallery_category_id' => $category->id, 'image_path' => 'gallery/shared.jpg', 'is_active' => true]);
        Facility::create(['name_tr' => 'Alan', 'name_en' => 'Area', 'category' => 'other', 'image_path' => 'gallery/shared.jpg', 'is_active' => true, 'sort_order' => 0]);

        $this->actingAs($owner)->delete('/admin/gallery/items/'.$item->id)->assertRedirect();
        $this->assertDatabaseMissing('gallery_items', ['id' => $item->id]);
        Storage::disk('public')->assertExists('gallery/shared.jpg');
    }
}
