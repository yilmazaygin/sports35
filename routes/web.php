<?php

use Illuminate\Support\Facades\Route;

if (app()->environment(['local', 'testing'])) {
    Route::middleware('web')
        ->group(base_path('routes/public.php'));

    Route::middleware('web')
        ->prefix('admin')
        ->group(base_path('routes/admin.php'));
} else {
    Route::middleware('web')
        ->domain(config('app.public_domain'))
        ->group(base_path('routes/public.php'));

    Route::middleware('web')
        ->domain(config('app.admin_domain'))
        ->group(base_path('routes/admin.php'));
}

// Keeps missing URLs inside the web stack so the error page has the session, locale, and public layout.
Route::fallback(function () {
    abort(404);
});
