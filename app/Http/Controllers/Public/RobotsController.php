<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Services\SearchDiscoveryService;
use Illuminate\Http\Response;

class RobotsController extends Controller
{
    public function __invoke(SearchDiscoveryService $discovery): Response
    {
        return response($discovery->robots(), 200, [
            'Content-Type' => 'text/plain; charset=UTF-8',
            'X-Robots-Tag' => 'noindex',
            'Cache-Control' => 'public, max-age=3600',
        ]);
    }
}
