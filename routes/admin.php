<?php

use App\Http\Controllers\Admin\BlogCategoryController;
use App\Http\Controllers\Admin\BlogPostController;
use App\Http\Controllers\Admin\CampaignController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\GalleryController;
use App\Http\Controllers\Admin\MediaController;
use App\Http\Controllers\Admin\MembershipPackageController;
use App\Http\Controllers\Admin\SiteSettingsController;
use App\Http\Controllers\Admin\SocialPostController;
use App\Http\Controllers\Admin\SpecialDayController;
use App\Http\Controllers\Admin\TransformationController;
use App\Http\Controllers\Admin\WorkingHoursController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/dashboard');

Route::middleware('guest')->group(function () {
    Route::get('login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('login', [AuthenticatedSessionController::class, 'store']);
});

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', DashboardController::class)->name('dashboard');

    Route::get('/working-hours', [WorkingHoursController::class, 'edit'])->name('working-hours.edit');
    Route::put('/working-hours', [WorkingHoursController::class, 'update'])->name('working-hours.update');

    Route::get('/membership-packages', [MembershipPackageController::class, 'index'])->name('membership-packages.index');
    Route::post('/membership-packages', [MembershipPackageController::class, 'store'])->name('membership-packages.store');
    Route::put('/membership-packages/{membershipPackage}', [MembershipPackageController::class, 'update'])->name('membership-packages.update');
    Route::delete('/membership-packages/{membershipPackage}', [MembershipPackageController::class, 'destroy'])->name('membership-packages.destroy');

    Route::get('/campaigns', [CampaignController::class, 'index'])->name('campaigns.index');
    Route::post('/campaigns', [CampaignController::class, 'store'])->name('campaigns.store');
    Route::put('/campaigns/{campaign}', [CampaignController::class, 'update'])->name('campaigns.update');
    Route::delete('/campaigns/{campaign}', [CampaignController::class, 'destroy'])->name('campaigns.destroy');

    Route::get('/special-days', [SpecialDayController::class, 'index'])->name('special-days.index');
    Route::post('/special-days', [SpecialDayController::class, 'store'])->name('special-days.store');
    Route::put('/special-days/{specialDay}', [SpecialDayController::class, 'update'])->name('special-days.update');
    Route::delete('/special-days/{specialDay}', [SpecialDayController::class, 'destroy'])->name('special-days.destroy');

    Route::get('/blog-categories', [BlogCategoryController::class, 'index'])->name('blog-categories.index');
    Route::post('/blog-categories', [BlogCategoryController::class, 'store'])->name('blog-categories.store');
    Route::put('/blog-categories/{blogCategory}', [BlogCategoryController::class, 'update'])->name('blog-categories.update');
    Route::delete('/blog-categories/{blogCategory}', [BlogCategoryController::class, 'destroy'])->name('blog-categories.destroy');

    Route::get('/blog-posts', [BlogPostController::class, 'index'])->name('blog-posts.index');
    Route::get('/blog-posts/create', [BlogPostController::class, 'create'])->name('blog-posts.create');
    Route::post('/blog-posts', [BlogPostController::class, 'store'])->name('blog-posts.store');
    Route::get('/blog-posts/{blogPost}/edit', [BlogPostController::class, 'edit'])->name('blog-posts.edit');
    Route::put('/blog-posts/{blogPost}', [BlogPostController::class, 'update'])->name('blog-posts.update');
    Route::delete('/blog-posts/{blogPost}', [BlogPostController::class, 'destroy'])->name('blog-posts.destroy');

    Route::get('/media', [MediaController::class, 'index'])->name('media.index');
    Route::post('/media', [MediaController::class, 'store'])->name('media.store');
    Route::delete('/media/{mediaFile}', [MediaController::class, 'destroy'])->name('media.destroy');

    Route::get('/gallery', [GalleryController::class, 'index'])->name('gallery.index');
    Route::post('/gallery/categories', [GalleryController::class, 'storeCategory'])->name('gallery.categories.store');
    Route::put('/gallery/categories/{galleryCategory}', [GalleryController::class, 'updateCategory'])->name('gallery.categories.update');
    Route::delete('/gallery/categories/{galleryCategory}', [GalleryController::class, 'destroyCategory'])->name('gallery.categories.destroy');
    Route::post('/gallery/items', [GalleryController::class, 'storeItem'])->name('gallery.items.store');
    Route::post('/gallery/items/{galleryItem}', [GalleryController::class, 'updateItem'])->name('gallery.items.update');
    Route::delete('/gallery/items/{galleryItem}', [GalleryController::class, 'destroyItem'])->name('gallery.items.destroy');

    Route::get('/transformations', [TransformationController::class, 'index'])->name('transformations.index');
    Route::post('/transformations', [TransformationController::class, 'store'])->name('transformations.store');
    Route::post('/transformations/{transformation}', [TransformationController::class, 'update'])->name('transformations.update');
    Route::delete('/transformations/{transformation}', [TransformationController::class, 'destroy'])->name('transformations.destroy');

    Route::get('/site-settings', [SiteSettingsController::class, 'edit'])->name('site-settings.edit');
    Route::put('/site-settings', [SiteSettingsController::class, 'update'])->name('site-settings.update');

    Route::get('/social-posts', [SocialPostController::class, 'index'])->name('social-posts.index');
    Route::post('/social-posts', [SocialPostController::class, 'store'])->name('social-posts.store');
    Route::post('/social-posts/{socialPost}', [SocialPostController::class, 'update'])->name('social-posts.update');
    Route::delete('/social-posts/{socialPost}', [SocialPostController::class, 'destroy'])->name('social-posts.destroy');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
});
