<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /**
     * Application::setLocale() overwrites config('app.locale') for the rest of the process.
     * Keep the original default so a later request can still recognize it.
     */
    private static ?string $defaultLocale = null;

    public function handle(Request $request, Closure $next): Response
    {
        $supported = config('app.supported_locales');
        $default = self::$defaultLocale ??= (string) config('app.locale');
        $query = $request->query('lang');
        $locale = $request->hasSession()
            ? (string) $request->session()->get('locale', $default)
            : $default;

        if (is_string($query) && in_array($query, $supported, true)) {
            $locale = $query;

            if ($request->hasSession()) {
                $request->session()->put('locale', $locale);
            }
        }

        if (! in_array($locale, $supported, true)) {
            $locale = (string) config('app.fallback_locale');
        }

        App::setLocale($locale);

        if (is_string($query) && $query === $default && in_array($request->method(), ['GET', 'HEAD'], true)) {
            $target = $request->url();
            $remaining = collect($request->query())
                ->reject(fn ($value, $key) => $key === 'lang' || ! is_string($value))
                ->all();

            if ($remaining !== []) {
                $target .= '?'.http_build_query($remaining);
            }

            return redirect()->to($target, 301);
        }

        return $next($request);
    }
}
