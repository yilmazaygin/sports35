<?php

use App\Http\Controllers\LocaleController;
use App\Http\Controllers\Public\BlogController;
use App\Http\Controllers\Public\CalculatorController;
use App\Http\Controllers\Public\CampaignController;
use App\Http\Controllers\Public\ContactController;
use App\Http\Controllers\Public\ConversionEventController;
use App\Http\Controllers\Public\GalleryController;
use App\Http\Controllers\Public\HomeController;
use App\Http\Controllers\Public\FreeTrialController;
use App\Http\Controllers\Public\MarketingPreferenceController;
use App\Http\Controllers\Public\RobotsController;
use App\Http\Controllers\Public\ServiceController;
use App\Http\Controllers\Public\SitemapController;
use App\Http\Controllers\Public\TransformationController;
use Illuminate\Support\Facades\Route;

Route::get('/sitemap.xml', SitemapController::class)->name('sitemap');
Route::get('/robots.txt', RobotsController::class)->name('robots');

Route::get('/', HomeController::class)->name('home');
Route::get('/locale/{locale}', LocaleController::class)->name('locale.switch');

Route::get('/hizmetler', ServiceController::class)->name('services');
Route::get('/galeri', GalleryController::class)->name('gallery');
Route::get('/degisimler', TransformationController::class)->name('transformations');
Route::get('/kampanyalar', CampaignController::class)->name('campaigns');
Route::get('/blog', [BlogController::class, 'index'])->name('blog.index');
Route::get('/blog/{slug}', [BlogController::class, 'show'])->name('blog.show');
Route::get('/iletisim', ContactController::class)->name('contact');
Route::get('/hesaplayicilar', CalculatorController::class)->name('calculators');
Route::get('/ucretsiz-deneme', [FreeTrialController::class, 'create'])->name('free-trial.create');
Route::post('/ucretsiz-deneme', [FreeTrialController::class, 'store'])->middleware('throttle:5,10')->name('free-trial.store');
Route::post('/analytics/events', [ConversionEventController::class, 'store'])->middleware('throttle:60,1')->name('analytics.events');
Route::get('/marketing/unsubscribe/{token}', [MarketingPreferenceController::class, 'unsubscribe'])->name('marketing.unsubscribe');
