<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Response;

class RobotsController extends Controller
{
    public function __invoke(): Response
    {
        $lines = [
            'User-agent: *',
            'Allow: /',
            'Disallow: /admin',
            'Disallow: /admin/*',
            '',
            'Sitemap: '.route('sitemap'),
        ];

        if (app()->environment('local')) {
            $lines[] = '';
            $lines[] = '# Local development';
        }

        return response(implode("\n", $lines), 200)
            ->header('Content-Type', 'text/plain');
    }
}
