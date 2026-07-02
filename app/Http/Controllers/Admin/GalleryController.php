<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreGalleryCategoryRequest;
use App\Http\Requests\Admin\StoreGalleryItemRequest;
use App\Http\Requests\Admin\UpdateGalleryCategoryRequest;
use App\Http\Requests\Admin\UpdateGalleryItemRequest;
use App\Models\GalleryCategory;
use App\Models\GalleryItem;
use App\Services\ImageOptimizer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class GalleryController extends Controller
{
    public function __construct(private ImageOptimizer $imageOptimizer) {}

    public function index(): Response
    {
        return Inertia::render('Admin/Gallery/Index', [
            'categories' => GalleryCategory::query()->withCount('items')->orderBy('sort_order')->get(),
            'items' => GalleryItem::query()->with('category')->orderBy('sort_order')->get()->map(fn ($i) => [
                'id' => $i->id,
                'gallery_category_id' => $i->gallery_category_id,
                'category_name' => $i->category->name_tr,
                'image_url' => $i->imageUrl(),
                'caption_tr' => $i->caption_tr,
                'caption_en' => $i->caption_en,
                'instagram_url' => $i->instagram_url,
                'sort_order' => $i->sort_order,
                'is_active' => $i->is_active,
            ]),
        ]);
    }

    public function storeCategory(StoreGalleryCategoryRequest $request): RedirectResponse
    {
        $data = $request->validated();
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

        if ($request->hasFile('image')) {
            Storage::disk('public')->delete($galleryItem->image_path);
            $data['image_path'] = $this->imageOptimizer->optimizeAndStore(
                $request->file('image'),
                'gallery/'.date('Y/m'),
            );
        }

        unset($data['image']);
        $galleryItem->update($data);

        return back()->with('success', __('admin.messages.saved'));
    }

    public function destroyItem(GalleryItem $galleryItem): RedirectResponse
    {
        Storage::disk('public')->delete($galleryItem->image_path);
        $galleryItem->delete();

        return back()->with('success', __('admin.messages.deleted'));
    }
}
