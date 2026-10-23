<?php

namespace App\Http\Controllers;

use App\Services\PublicSeo;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class LocaleController extends Controller
{
    public function __invoke(Request $request, string $locale): RedirectResponse
    {
        if (! in_array($locale, config('app.supported_locales'), true)) {
            abort(404);
        }

        $request->session()->put('locale', $locale);

        $previous = parse_url(url()->previous()) ?: [];
        $path = '/'.ltrim((string) ($previous['path'] ?? '/'), '/');

        if (str_starts_with($path, '/locale')) {
            $path = '/';
        }

        $query = [];
        parse_str((string) ($previous['query'] ?? ''), $parsed);

        foreach ($parsed as $key => $value) {
            if (is_string($key) && is_string($value) && $key !== 'lang') {
                $query[$key] = $value;
            }
        }

        return redirect()->to(PublicSeo::localizedUrl($path, $locale, $query));
    }
}
