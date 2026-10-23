<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\GalleryCategory;
use App\Models\GalleryItem;
use App\Models\MediaFile;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GalleryController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $categorySlug = $request->query('category');

        $activeItems = GalleryItem::query()->where('is_active', true);
        $categoryIdsWithItems = (clone $activeItems)
            ->whereNotNull('gallery_category_id')
            ->distinct()
            ->pluck('gallery_category_id');
        $hasUncategorized = (clone $activeItems)->whereNull('gallery_category_id')->exists();
        $showFilters = $categoryIdsWithItems->count() + ($hasUncategorized ? 1 : 0) > 1;

        $categories = $showFilters
            ? GalleryCategory::query()
                ->whereIn('id', $categoryIdsWithItems)
                ->orderBy('sort_order')
                ->get()
                ->map(fn ($c) => [
                    'id' => $c->id,
                    'slug' => $c->slug,
                    'name' => $c->localizedName(),
                ])
            : [];

        $itemsQuery = GalleryItem::query()
            ->with('category')
            ->where('is_active', true)
            ->orderBy('sort_order');

        if ($categorySlug) {
            $itemsQuery->whereHas('category', fn ($q) => $q->where('slug', $categorySlug));
        }

        $galleryItems = $itemsQuery->get();
        $mediaAlt = MediaFile::query()
            ->whereIn('path', $galleryItems->pluck('image_path'))
            ->get()
            ->keyBy('path');

        $items = $galleryItems->map(function (GalleryItem $item) use ($mediaAlt) {
            $media = $mediaAlt->get($item->image_path);
            $alt = app()->getLocale() === 'en' ? $media?->alt_en : $media?->alt_tr;

            return [
                'id' => $item->id,
                'image_url' => $item->imageUrl(),
                'alt' => $alt ?: $item->localizedCaption() ?: __('public.gallery_page.title'),
                'caption' => $item->localizedCaption(),
                'instagram_url' => $item->instagram_url,
                'category_slug' => $item->category?->slug,
            ];
        });

        return Inertia::render('Public/Gallery/Index', [
            'categories' => $categories,
            'items' => $items,
            'activeCategory' => $categorySlug,
        ]);
    }
}
