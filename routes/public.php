<?php

use App\Http\Controllers\LocaleController;
use App\Http\Controllers\Public\BlogController;
use App\Http\Controllers\Public\CalculatorController;
use App\Http\Controllers\Public\ContactController;
use App\Http\Controllers\Public\GalleryController;
use App\Http\Controllers\Public\HomeController;
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
Route::get('/blog', [BlogController::class, 'index'])->name('blog.index');
Route::get('/blog/{slug}', [BlogController::class, 'show'])->name('blog.show');
Route::get('/iletisim', ContactController::class)->name('contact');
Route::get('/hesaplayicilar', CalculatorController::class)->name('calculators');
