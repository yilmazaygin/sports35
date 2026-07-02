<?php

namespace App\Http\Middleware;

use App\Models\SiteSetting;
use App\Services\StructuredDataService;
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
            ],
            'app' => [
                'name' => config('app.name'),
            ],
            'contact' => fn () => SiteSetting::contact(),
            'structured_data' => fn () => app(StructuredDataService::class)->localBusiness(),
            'seo' => [
                'site_name' => config('app.name'),
                'default_description' => fn () => __('public.seo.default_description'),
            ],
        ];
    }
}
