<?php

namespace App\Providers;

use App\Models\BlogCategory;
use App\Models\BlogPost;
use App\Models\Campaign;
use App\Models\Facility;
use App\Models\GalleryItem;
use App\Models\MediaFile;
use App\Models\MembershipPackage;
use App\Models\SiteSetting;
use App\Models\SpecialDay;
use App\Models\Transformation;
use App\Models\User;
use App\Models\WorkingHour;
use App\Observers\AuditObserver;
use App\Services\InertiaSsrGateway;
use App\Services\PublicSeo;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Inertia\Ssr\Gateway;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->app->bind(Gateway::class, InertiaSsrGateway::class);

        Vite::prefetch(concurrency: 3);

        View::composer('app', function ($view): void {
            $view->with('publicSeo', app(PublicSeo::class)->forRequest(request()));
        });
        foreach ([User::class, Campaign::class, MembershipPackage::class, WorkingHour::class, BlogCategory::class, BlogPost::class, MediaFile::class, GalleryItem::class, Transformation::class, Facility::class, SpecialDay::class, SiteSetting::class] as $model) {
            $model::observe(AuditObserver::class);
        }
    }
}
