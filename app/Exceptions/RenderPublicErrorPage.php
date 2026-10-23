<?php

namespace App\Exceptions;

use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class RenderPublicErrorPage
{
    public function __invoke(Response $response, Throwable $exception, Request $request): Response
    {
        $status = $response->getStatusCode();

        if (! $this->shouldReplace($status, $request)) {
            return $response;
        }

        try {
            $request->attributes->set('public_error_page', true);
            $this->ensureSharedProps($request);

            $rendered = Inertia::render('Error', [
                'status' => $status,
                'retryAfter' => $this->retryAfter($response),
            ])->toResponse($request)->setStatusCode($status);

            $rendered->headers->set('X-Robots-Tag', 'noindex');
            $this->copyHeader($response, $rendered, 'Retry-After');
            $this->copyHeader($response, $rendered, 'Refresh');

            return $rendered;
        } catch (Throwable) {
            return $this->fallback($response, $status);
        }
    }

    private function shouldReplace(int $status, Request $request): bool
    {
        if ($status < 400 || $status >= 600 || $status === 422) {
            return false;
        }

        if ($request->expectsJson() && ! $request->headers->has('X-Inertia')) {
            return false;
        }

        // Leave real server errors visible while debugging. Maintenance is intentional.
        if ($status >= 500 && $status !== 503 && config('app.debug')) {
            return false;
        }

        return true;
    }

    private function ensureSharedProps(Request $request): void
    {
        if (Inertia::getShared('translations') !== null) {
            return;
        }

        try {
            $shared = app(HandleInertiaRequests::class)->share($request);
        } catch (Throwable) {
            $shared = $this->minimalShared();
        }

        if (! $request->hasSession()) {
            $shared['auth'] = ['user' => null];
            $shared['flash'] = ['success' => null, 'error' => null];
        }

        Inertia::share($shared);
    }

    private function minimalShared(): array
    {
        return [
            'auth' => ['user' => null],
            'locale' => app()->getLocale(),
            'locales' => config('app.supported_locales', ['tr', 'en']),
            'translations' => [
                'public' => __('public'),
                'admin' => [],
            ],
            'flash' => ['success' => null, 'error' => null],
            'app' => ['name' => config('app.name', 'Sports35')],
            'publicSiteUrl' => url('/'),
            'contact' => ['social_accounts' => []],
            'hero' => ['video_audio' => false],
            'blogEnabled' => false,
            'structured_data' => null,
            'seo' => [
                'site_name' => config('app.name', 'Sports35'),
                'default_description' => __('public.seo.default_description'),
            ],
        ];
    }

    private function fallback(Response $original, int $status): Response
    {
        $response = response()->view('errors.page', [
            'status' => $status,
            'retryAfter' => $this->retryAfter($original),
        ], $status);

        $response->headers->set('X-Robots-Tag', 'noindex');
        $this->copyHeader($original, $response, 'Retry-After');
        $this->copyHeader($original, $response, 'Refresh');

        return $response;
    }

    private function retryAfter(Response $response): ?int
    {
        $value = $response->headers->get('Retry-After');

        return is_numeric($value) ? (int) $value : null;
    }

    private function copyHeader(Response $from, Response $to, string $name): void
    {
        if ($from->headers->has($name)) {
            $to->headers->set($name, $from->headers->get($name));
        }
    }
}
