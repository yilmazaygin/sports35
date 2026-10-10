<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreGalleryCategoryRequest;
use App\Http\Requests\Admin\StoreGalleryItemRequest;
use App\Http\Requests\Admin\UpdateGalleryCategoryRequest;
use App\Http\Requests\Admin\UpdateGalleryItemRequest;
use App\Models\GalleryCategory;
use App\Models\GalleryItem;
use App\Models\MediaFile;
use App\Models\BlogPost;
use App\Models\Facility;
use App\Models\Trainer;
use App\Models\Transformation;
use App\Models\SocialPost;
use App\Models\Testimonial;
use App\Services\ImageOptimizer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;

class GalleryController extends Controller
{
    public function __construct(private ImageOptimizer $imageOptimizer) {}

    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim()->toString();
        $items = GalleryItem::query()->with('category')->when($search, fn ($query) => $query->where('caption_tr', 'like', "%{$search}%")->orWhere('caption_en', 'like', "%{$search}%"))->orderBy('sort_order')->paginate(20)->withQueryString();
        $mediaAlt = MediaFile::query()
            ->whereIn('path', $items->getCollection()->pluck('image_path'))
            ->get(['path', 'alt_tr', 'alt_en'])
            ->keyBy('path');
        return Inertia::render('Admin/Gallery/Index', [
            'categories' => GalleryCategory::query()->withCount('items')->orderBy('sort_order')->get(),
            'items' => $items->getCollection()->map(fn ($i) => [
                'id' => $i->id,
                'gallery_category_id' => $i->gallery_category_id,
                'category_name' => $i->category->name_tr,
                'image_url' => $i->imageUrl(),
                'caption_tr' => $i->caption_tr,
                'caption_en' => $i->caption_en,
                'alt_tr' => $mediaAlt->get($i->image_path)?->alt_tr,
                'alt_en' => $mediaAlt->get($i->image_path)?->alt_en,
                'instagram_url' => $i->instagram_url,
                'sort_order' => $i->sort_order,
                'is_active' => $i->is_active,
            ]),
            'pagination' => $items->toArray()['links'],
            'search' => $search,
        ]);
    }

    public function storeCategory(StoreGalleryCategoryRequest $request): RedirectResponse
    {
        $data = $request->validated();

        $mediaData = array_intersect_key($data, array_flip(['alt_tr', 'alt_en']));
        unset($data['alt_tr'], $data['alt_en']);
        $data['slug'] = Str::slug($data['name_tr']);
        GalleryCategory::create($data);

        return back()->with('success', __('admin.messages.created'));
    }

    public function updateCategory(UpdateGalleryCategoryRequest $request, GalleryCategory $galleryCategory): RedirectResponse
    {
        $data = $request->validated();
        $data['slug'] = Str::slug($data['name_tr']);
        $galleryCategory->update($data);

        return back()->with('success', __('admin.messages.saved'));
    }

    public function destroyCategory(GalleryCategory $galleryCategory): RedirectResponse
    {
        if ($galleryCategory->items()->exists()) {
            return back()->with('error', __('admin.gallery.category_in_use'));
        }

        $galleryCategory->delete();

        return back()->with('success', __('admin.messages.deleted'));
    }

    public function storeItem(StoreGalleryItemRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['image_path'] = $this->imageOptimizer->optimizeAndStore(
            $request->file('image'),
            'gallery/'.date('Y/m'),
        );
        unset($data['image']);
        GalleryItem::create($data);

        return back()->with('success', __('admin.messages.created'));
    }

    public function updateItem(UpdateGalleryItemRequest $request, GalleryItem $galleryItem): RedirectResponse
    {
        $data = $request->validated();
        $mediaData = array_intersect_key($data, array_flip(['alt_tr', 'alt_en']));
        unset($data['alt_tr'], $data['alt_en']);

        if ($request->hasFile('image')) {
            Storage::disk('public')->delete($galleryItem->image_path);
            $data['image_path'] = $this->imageOptimizer->optimizeAndStore(
                $request->file('image'),
                'gallery/'.date('Y/m'),
            );
        }

        unset($data['image']);
        $galleryItem->update($data);

        if ($mediaData !== []) {
            MediaFile::query()->where('path', $galleryItem->image_path)->update($mediaData);
        }

        return back()->with('success', __('admin.messages.saved'));
    }

    public function destroyItem(GalleryItem $galleryItem): RedirectResponse
    {
        $path = $galleryItem->image_path;
        $galleryItem->delete();

        if (! $this->isPathReferenced($path)) {
            Storage::disk('public')->delete($path);
        }

        return back()->with('success', __('admin.messages.deleted'));
    }

    private function isPathReferenced(string $path): bool
    {
        return BlogPost::where('featured_image', $path)->exists()
            || GalleryItem::where('image_path', $path)->exists()
            || Facility::where('image_path', $path)->exists()
            || Trainer::where('photo_path', $path)->exists()
            || Transformation::where('before_image', $path)->orWhere('after_image', $path)->exists()
            || SocialPost::where('image_path', $path)->exists()
            || Testimonial::where('photo_path', $path)->exists();
    }
}
