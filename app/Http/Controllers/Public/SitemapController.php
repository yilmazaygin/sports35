<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Services\SearchDiscoveryService;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function __invoke(SearchDiscoveryService $discovery): Response
    {
        return response($discovery->sitemap(), 200, [
            'Content-Type' => 'application/xml; charset=UTF-8',
            'X-Robots-Tag' => 'noindex',
            'Cache-Control' => 'public, max-age=3600',
        ]);
    }
}
