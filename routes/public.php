<?php

use App\Http\Controllers\LocaleController;
use App\Http\Controllers\Public\BlogController;
use App\Http\Controllers\Public\CookiePolicyController;
use App\Http\Controllers\Public\PrivacyController;
use App\Http\Controllers\Public\GalleryController;
use App\Http\Controllers\Public\HomeController;
use App\Http\Controllers\Public\LlmsController;
use App\Http\Controllers\Public\RobotsController;
use App\Http\Controllers\Public\SitemapController;
use Illuminate\Support\Facades\Route;

Route::get('/sitemap.xml', SitemapController::class)->name('sitemap');
Route::get('/robots.txt', RobotsController::class)->name('robots');
Route::get('/llms.txt', [LlmsController::class, 'summary'])->name('llms');
Route::get('/llms-full.txt', [LlmsController::class, 'full'])->name('llms.full');

Route::get('/', HomeController::class)->name('home');
Route::get('/locale/{locale}', LocaleController::class)->name('locale.switch');

Route::get('/galeri', GalleryController::class)->name('gallery');
Route::get('/cerez-ve-guvenlik', CookiePolicyController::class)->name('cookies');
Route::get('/aydinlatma-metni', PrivacyController::class)->name('privacy');
Route::get('/blog', [BlogController::class, 'index'])->name('blog.index');
Route::get('/blog/{slug}', [BlogController::class, 'show'])->name('blog.show');
