<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function __invoke(): Response
    {
        $urls = [
            ['loc' => route('home'), 'priority' => '1.0', 'changefreq' => 'daily'],
            ['loc' => route('services'), 'priority' => '0.8', 'changefreq' => 'monthly'],
            ['loc' => route('gallery'), 'priority' => '0.8', 'changefreq' => 'weekly'],
            ['loc' => route('transformations'), 'priority' => '0.8', 'changefreq' => 'weekly'],
            ['loc' => route('blog.index'), 'priority' => '0.9', 'changefreq' => 'daily'],
            ['loc' => route('contact'), 'priority' => '0.7', 'changefreq' => 'monthly'],
            ['loc' => route('calculators'), 'priority' => '0.6', 'changefreq' => 'monthly'],
        ];

        $posts = BlogPost::query()
            ->where('is_published', true)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->get(['slug', 'updated_at']);

        foreach ($posts as $post) {
            $urls[] = [
                'loc' => route('blog.show', $post->slug),
                'priority' => '0.7',
                'changefreq' => 'monthly',
                'lastmod' => $post->updated_at?->toAtomString(),
            ];
        }

        $xml = '<?xml version="1.0" encoding="UTF-8"?>'."\n";
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'."\n";

        foreach ($urls as $url) {
            $xml .= "  <url>\n";
            $xml .= '    <loc>'.e($url['loc'])."</loc>\n";
            if (! empty($url['lastmod'])) {
                $xml .= '    <lastmod>'.$url['lastmod']."</lastmod>\n";
            }
            $xml .= '    <changefreq>'.$url['changefreq']."</changefreq>\n";
            $xml .= '    <priority>'.$url['priority']."</priority>\n";
            $xml .= "  </url>\n";
        }

        $xml .= '</urlset>';

        return response($xml, 200)->header('Content-Type', 'application/xml');
    }
}
