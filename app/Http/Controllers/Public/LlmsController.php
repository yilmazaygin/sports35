<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Services\SearchDiscoveryService;
use Illuminate\Http\Response;

class LlmsController extends Controller
{
    public function summary(SearchDiscoveryService $discovery): Response
    {
        return $this->text($discovery->llms());
    }

    public function full(SearchDiscoveryService $discovery): Response
    {
        return $this->text($discovery->llms(full: true));
    }

    private function text(string $body): Response
    {
        return response($body, 200, [
            'Content-Type' => 'text/plain; charset=UTF-8',
            'Cache-Control' => 'public, max-age=3600',
        ]);
    }
}
