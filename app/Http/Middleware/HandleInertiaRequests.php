<?php

namespace App\Http\Middleware;

use App\Models\Facility;
use App\Models\SiteSetting;
use App\Services\PublicSeo;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'locale' => fn () => app()->getLocale(),
            'locales' => config('app.supported_locales'),
            'translations' => fn () => [
                'public' => __('public'),
                'admin' => __('admin'),
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'app' => [
                'name' => config('app.name'),
            ],
            'publicSiteUrl' => fn () => app()->environment(['local', 'testing'])
                ? url('/')
                : 'https://'.config('app.public_domain'),
            'contact' => fn () => SiteSetting::contact(),
            'hero' => fn () => [
                'video_audio' => SiteSetting::videoAudioEnabled(),
            ],
            'blogEnabled' => fn () => SiteSetting::blogEnabled(),
            'hasFacilities' => fn () => Facility::query()->where('is_active', true)->exists(),
            'seo' => function () use ($request) {
                $seo = app(PublicSeo::class)->forRequest($request);
                unset($seo['json_ld']);

                return $seo;
            },
        ];
    }
}
