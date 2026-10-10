<?php

namespace Tests\Feature;

use App\Models\GalleryCategory;
use App\Models\GalleryItem;
use App\Models\MediaFile;
use App\Models\Facility;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AdminGalleryEditingTest extends TestCase
{
    use RefreshDatabase;

    public function test_owner_can_update_bilingual_gallery_metadata_without_replacing_image(): void
    {
        $owner = User::factory()->create(['role' => 'owner']);
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

    public function test_content_editor_can_edit_gallery_metadata_but_cannot_edit_owner_only_settings(): void
    {
        $editor = User::factory()->create(['role' => 'content_editor']);
        $this->actingAs($editor)->get('/admin/gallery')->assertOk();
        $this->actingAs($editor)->get('/admin/site-settings')->assertForbidden();
    }

    public function test_gallery_edit_validation_rejects_overlong_alt_text(): void
    {
        $owner = User::factory()->create(['role' => 'owner']);
        $category = GalleryCategory::create(['name_tr' => 'Salon', 'name_en' => 'Gym', 'slug' => 'salon']);
        $item = GalleryItem::create(['gallery_category_id' => $category->id, 'image_path' => 'gallery/original.jpg', 'is_active' => true]);

        $this->actingAs($owner)->post('/admin/gallery/items/'.$item->id, [
            'gallery_category_id' => $category->id,
            'alt_tr' => str_repeat('x', 256),
            'sort_order' => 0,
            'is_active' => true,
        ])->assertSessionHasErrors('alt_tr');
    }

    public function test_gallery_category_with_items_cannot_be_deleted(): void
    {
        $owner = User::factory()->create(['role' => 'owner']);
        $category = GalleryCategory::create(['name_tr' => 'Salon', 'name_en' => 'Gym', 'slug' => 'salon']);
        GalleryItem::create(['gallery_category_id' => $category->id, 'image_path' => 'gallery/used.jpg', 'is_active' => true]);

        $this->actingAs($owner)->delete('/admin/gallery/categories/'.$category->id)->assertRedirect();
        $this->assertDatabaseHas('gallery_categories', ['id' => $category->id]);
    }

    public function test_gallery_delete_preserves_a_shared_image_path(): void
    {
        Storage::fake('public');
        Storage::disk('public')->put('gallery/shared.jpg', 'image');
        $owner = User::factory()->create(['role' => 'owner']);
        $category = GalleryCategory::create(['name_tr' => 'Salon', 'name_en' => 'Gym', 'slug' => 'salon']);
        $item = GalleryItem::create(['gallery_category_id' => $category->id, 'image_path' => 'gallery/shared.jpg', 'is_active' => true]);
        Facility::create(['name_tr' => 'Alan', 'name_en' => 'Area', 'category' => 'other', 'image_path' => 'gallery/shared.jpg', 'is_active' => true, 'sort_order' => 0]);

        $this->actingAs($owner)->delete('/admin/gallery/items/'.$item->id)->assertRedirect();
        $this->assertDatabaseMissing('gallery_items', ['id' => $item->id]);
        Storage::disk('public')->assertExists('gallery/shared.jpg');
    }
}
