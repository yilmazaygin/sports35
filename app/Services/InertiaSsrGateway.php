<?php

namespace App\Services;

use Inertia\Ssr\HttpGateway;
use Inertia\Ssr\Response;
use Tighten\Ziggy\Ziggy;

class InertiaSsrGateway extends HttpGateway
{
    public function dispatch(array $page): ?Response
    {
        $ziggy = (new Ziggy)->jsonSerialize();
        $page['props']['ziggy'] = [
            ...$ziggy,
            'location' => request()->fullUrl(),
        ];

        $response = parent::dispatch($page);

        if ($response instanceof Response) {
            $response->head = str_replace('hrefLang=', 'hreflang=', $response->head);
        }

        return $response;
    }
}
