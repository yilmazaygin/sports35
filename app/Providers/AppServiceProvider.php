<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use App\Models\BlogCategory;
use App\Models\BlogPost;
use App\Models\Campaign;
use App\Models\Facility;
use App\Models\GalleryItem;
use App\Models\GroupClass;
use App\Models\Lead;
use App\Models\MediaFile;
use App\Models\MembershipPackage;
use App\Models\SocialPost;
use App\Models\SiteSetting;
use App\Models\SpecialDay;
use App\Models\Testimonial;
use App\Models\Trainer;
use App\Models\Transformation;
use App\Models\User;
use App\Models\WorkingHour;
use App\Observers\AuditObserver;

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
        Vite::prefetch(concurrency: 3);
        foreach ([User::class, Lead::class, Campaign::class, MembershipPackage::class, WorkingHour::class, BlogCategory::class, BlogPost::class, MediaFile::class, GalleryItem::class, Transformation::class, Trainer::class, GroupClass::class, Facility::class, SocialPost::class, SpecialDay::class, Testimonial::class, SiteSetting::class] as $model) {
            $model::observe(AuditObserver::class);
        }
    }
}
