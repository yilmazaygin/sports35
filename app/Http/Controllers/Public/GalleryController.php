<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\BlogCategory;
use App\Models\BlogPost;
use App\Models\GalleryCategory;
use App\Models\GalleryItem;
use App\Models\SiteSetting;
use App\Models\Transformation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GalleryController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $categorySlug = $request->query('category');

        $categories = GalleryCategory::query()
            ->orderBy('sort_order')
            ->get()
            ->map(fn ($c) => [
                'id' => $c->id,
                'slug' => $c->slug,
                'name' => $c->localizedName(),
            ]);

        $itemsQuery = GalleryItem::query()
            ->with('category')
            ->where('is_active', true)
            ->orderBy('sort_order');

        if ($categorySlug) {
            $itemsQuery->whereHas('category', fn ($q) => $q->where('slug', $categorySlug));
        }

        $items = $itemsQuery->get()->map(fn (GalleryItem $item) => [
            'id' => $item->id,
            'image_url' => $item->imageUrl(),
            'caption' => $item->localizedCaption(),
            'instagram_url' => $item->instagram_url,
            'category_slug' => $item->category->slug,
        ]);

        return Inertia::render('Public/Gallery/Index', [
            'categories' => $categories,
            'items' => $items,
            'activeCategory' => $categorySlug,
        ]);
    }
}
