<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\BlogCategory;
use App\Models\BlogPost;
use App\Models\SiteSetting;
use App\Support\SafeHtml;
use Inertia\Inertia;
use Inertia\Response;

class BlogController extends Controller
{
    public function index(): Response
    {
        $this->ensureEnabled();

        $posts = BlogPost::query()
            ->with('category')
            ->where('is_published', true)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->latest('published_at')
            ->get()
            ->map(fn (BlogPost $post) => $this->listItem($post));

        $categories = BlogCategory::query()
            ->orderBy('sort_order')
            ->get()
            ->map(fn ($c) => ['id' => $c->id, 'name' => $c->localizedName(), 'slug' => $c->slug]);

        return Inertia::render('Public/Blog/Index', [
            'posts' => $posts,
            'categories' => $categories,
        ]);
    }

    public function show(string $slug): Response
    {
        $this->ensureEnabled();

        $post = BlogPost::query()
            ->with('category')
            ->where('slug', $slug)
            ->where('is_published', true)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->firstOrFail();

        $locale = app()->getLocale();

        return Inertia::render('Public/Blog/Show', [
            'post' => [
                'title' => $locale === 'en' ? $post->title_en : $post->title_tr,
                'content' => SafeHtml::sanitize($locale === 'en' ? $post->content_en : $post->content_tr),
                'excerpt' => $locale === 'en' ? $post->excerpt_en : $post->excerpt_tr,
                'category' => $post->category?->localizedName(),
                'published_at' => $post->published_at?->format('d.m.Y'),
                'featured_image' => $post->featured_image,
                'meta_title' => $locale === 'en' ? ($post->meta_title_en ?: $post->title_en) : ($post->meta_title_tr ?: $post->title_tr),
                'meta_description' => $locale === 'en' ? $post->meta_description_en : $post->meta_description_tr,
            ],
        ]);
    }

    private function ensureEnabled(): void
    {
        abort_unless(SiteSetting::blogEnabled(), 404);
    }

    private function listItem(BlogPost $post): array
    {
        $locale = app()->getLocale();

        return [
            'slug' => $post->slug,
            'title' => $locale === 'en' ? $post->title_en : $post->title_tr,
            'excerpt' => $locale === 'en' ? $post->excerpt_en : $post->excerpt_tr,
            'category' => $post->category?->localizedName(),
            'published_at' => $post->published_at?->format('d.m.Y'),
            'featured_image' => $post->featured_image,
        ];
    }
}
