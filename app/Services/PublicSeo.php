<?php

namespace App\Services;

use App\Models\BlogPost;
use Illuminate\Http\Request;

class PublicSeo
{
    private ?BlogPost $resolvedPost = null;

    private bool $postResolved = false;

    public function __construct(private StructuredDataService $structuredData) {}

    public function forRequest(Request $request): array
    {
        $cached = $request->attributes->get('public_seo');

        if (is_array($cached)) {
            return $cached;
        }

        $seo = $this->build($request);
        $request->attributes->set('public_seo', $seo);

        return $seo;
    }

    public static function siteUrl(): string
    {
        if (app()->environment(['local', 'testing'])) {
            return rtrim(url('/'), '/');
        }

        return 'https://'.config('app.public_domain');
    }

    public static function absoluteUrl(string $path): string
    {
        $site = rtrim(self::siteUrl(), '/');

        if (preg_match('#^https?://#i', $path) === 1) {
            $storagePath = parse_url($path, PHP_URL_PATH) ?: '';

            if (str_starts_with($storagePath, '/storage/')) {
                return $site.$storagePath;
            }

            return $path;
        }

        return $site.'/'.ltrim($path, '/');
    }

    public static function localizedUrl(string $path, string $locale, array $query = []): string
    {
        $base = rtrim(self::siteUrl(), '/');
        $path = '/'.ltrim($path, '/');
        $url = $path === '/' ? $base : $base.$path;
        $query = array_filter(
            $query,
            fn ($value, $key) => is_string($key) && is_string($value) && $value !== '',
            ARRAY_FILTER_USE_BOTH,
        );

        if ($locale === 'en') {
            $query['lang'] = 'en';
        } else {
            unset($query['lang']);
        }

        ksort($query);

        if ($query === []) {
            return $url;
        }

        return $url.'?'.http_build_query($query);
    }

    public function indexable(Request $request): bool
    {
        if ($request->attributes->get('public_error_page')) {
            return false;
        }

        if (! app()->environment(['local', 'testing']) && $request->getHost() === config('app.admin_domain')) {
            return false;
        }

        return ! $request->is([
            'admin',
            'admin/*',
            'login',
            'register',
            'forgot-password',
            'reset-password',
            'reset-password/*',
            'verify-email',
            'verify-email/*',
            'confirm-password',
            'profile',
            'profile/*',
            'dashboard',
            'locale',
            'locale/*',
            'up',
        ]);
    }

    private function build(Request $request): array
    {
        $indexable = $this->indexable($request);
        $page = $indexable ? $this->page($request) : ['title' => $this->brand(), 'description' => ''];
        $brand = $this->brand();
        $documentTitle = $page['title'] === $brand ? $brand : $page['title'].' - '.$brand;
        $path = $this->path($request);
        $query = $this->publicQuery($request);
        $locale = app()->getLocale() === 'en' ? 'en' : 'tr';

        return [
            'indexable' => $indexable,
            'document_title' => $documentTitle,
            'description' => $page['description'],
            'canonical' => self::localizedUrl($path, $locale, $query),
            'image' => $indexable ? $this->image($request) : '',
            'locale' => $locale === 'en' ? 'en_US' : 'tr_TR',
            'locale_alternate' => $locale === 'en' ? 'tr_TR' : 'en_US',
            'og_type' => $request->is('blog/*') ? 'article' : 'website',
            'alternates' => $indexable ? [
                ['hreflang' => 'tr', 'href' => self::localizedUrl($path, 'tr', $query)],
                ['hreflang' => 'en', 'href' => self::localizedUrl($path, 'en', $query)],
                ['hreflang' => 'x-default', 'href' => self::localizedUrl($path, 'tr', $query)],
            ] : [],
            'site_name' => $brand,
            'json_ld' => $indexable ? $this->structuredData->localBusiness() : null,
            'llms' => route('llms'),
        ];
    }

    private function path(Request $request): string
    {
        $path = $request->path();

        return ($path === '' || $path === '/') ? '/' : '/'.$path;
    }

    private function publicQuery(Request $request): array
    {
        $category = $request->query('category');

        if ($request->is('galeri') && is_string($category) && $category !== '') {
            return ['category' => $category];
        }

        return [];
    }

    private function page(Request $request): array
    {
        if ($request->is('galeri')) {
            return [
                'title' => __('public.seo.gallery_title'),
                'description' => __('public.seo.gallery_description'),
            ];
        }

        if ($request->is('cerez-ve-guvenlik')) {
            return [
                'title' => __('public.seo.cookies_title'),
                'description' => __('public.seo.cookies_description'),
            ];
        }

        if ($request->is('aydinlatma-metni')) {
            return [
                'title' => __('public.seo.privacy_title'),
                'description' => __('public.seo.privacy_description'),
            ];
        }

        if ($request->is('blog')) {
            return [
                'title' => __('public.seo.blog_title'),
                'description' => __('public.seo.blog_description'),
            ];
        }

        if ($request->is('blog/*')) {
            $post = $this->publishedPost((string) $request->segment(2));

            if ($post) {
                $english = app()->getLocale() === 'en';
                $title = $english
                    ? ($post->meta_title_en ?: $post->title_en)
                    : ($post->meta_title_tr ?: $post->title_tr);
                $description = $english
                    ? ($post->meta_description_en ?: $post->excerpt_en)
                    : ($post->meta_description_tr ?: $post->excerpt_tr);

                return [
                    'title' => $title ?: __('public.seo.blog_title'),
                    'description' => $description ?: __('public.seo.blog_description'),
                ];
            }
        }

        return [
            'title' => __('public.seo.home_title'),
            'description' => __('public.seo.default_description'),
        ];
    }

    private function image(Request $request): string
    {
        if ($request->is('blog/*')) {
            $featured = $this->publishedPost((string) $request->segment(2))?->featured_image;

            if (is_string($featured) && $featured !== '') {
                return self::absoluteUrl($featured);
            }
        }

        return self::absoluteUrl('/images/og.jpg');
    }

    private function publishedPost(string $slug): ?BlogPost
    {
        if ($this->postResolved) {
            return $this->resolvedPost;
        }

        $this->postResolved = true;

        if ($slug === '') {
            return $this->resolvedPost = null;
        }

        return $this->resolvedPost = BlogPost::query()
            ->where('slug', $slug)
            ->where('is_published', true)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->first();
    }

    private function brand(): string
    {
        return 'Sports35';
    }
}
