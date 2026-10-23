@php
    $status = (int) ($status ?? 500);

    if ($status < 400 || $status > 599) {
        $status = 500;
    }

    $known = [401, 403, 404, 419, 429, 500, 503];
    $key = in_array($status, $known, true) ? (string) $status : 'fallback';
    $title = __("public.error_pages.{$key}.title");
    $message = __("public.error_pages.{$key}.message");
    $homeUrl = url('/');
    $loginUrl = $status === 401 && \Illuminate\Support\Facades\Route::has('login') ? route('login') : null;
    $appName = 'Sports35';
    $seconds = is_numeric($retryAfter ?? null) ? (int) $retryAfter : null;
    $showRetry = $status === 429 || $status >= 500;
@endphp
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <meta name="robots" content="noindex">
    <meta name="theme-color" content="#0B0B0B">
    <title>{{ $title }} - {{ $appName }}</title>
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=inter:400,500,600,700,800,900&display=swap" rel="stylesheet">
    <style>
        :root { color-scheme: dark; }
        * { box-sizing: border-box; }
        body {
            margin: 0;
            min-height: 100vh;
            min-height: 100svh;
            display: flex;
            flex-direction: column;
            background: #0b0b0b;
            color: #fff;
            font-family: Inter, ui-sans-serif, system-ui, sans-serif;
        }
        a { color: inherit; }
        .top {
            display: flex;
            align-items: center;
            height: 4rem;
            padding: 0 1.25rem;
            border-bottom: 1px solid #292929;
        }
        .wordmark {
            font-size: 1.125rem;
            font-weight: 900;
            letter-spacing: 0.08em;
            text-decoration: none;
        }
        .wordmark span { color: #f25a0a; }
        main {
            position: relative;
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            padding: 4rem 1.25rem;
            text-align: center;
        }
        main::before {
            content: "";
            position: absolute;
            inset: 0;
            background: radial-gradient(ellipse at top, rgba(242, 90, 10, 0.18), transparent 58%);
            pointer-events: none;
        }
        .content { position: relative; width: min(100%, 40rem); }
        .code {
            margin: 0;
            font-size: clamp(4.5rem, 14vw, 6rem);
            font-weight: 900;
            line-height: 1;
            letter-spacing: -0.04em;
            color: #f25a0a;
        }
        h1 {
            margin: 1.25rem 0 0;
            font-size: clamp(1.75rem, 4vw, 3rem);
            font-weight: 900;
            line-height: 1.1;
            letter-spacing: -0.03em;
            text-transform: uppercase;
        }
        .message, .hint {
            max-width: 28rem;
            margin: 1rem auto 0;
            color: #a1a1aa;
            font-size: 1.05rem;
            line-height: 1.6;
        }
        .hint { color: #71717a; font-size: 0.875rem; }
        .actions {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 0.75rem;
            margin-top: 2rem;
        }
        .button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-height: 2.75rem;
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            border: 2px solid transparent;
            font: inherit;
            font-size: 0.875rem;
            font-weight: 800;
            letter-spacing: 0.04em;
            text-transform: uppercase;
            text-decoration: none;
            cursor: pointer;
        }
        .button.primary { background: #f25a0a; color: #fff; }
        .button.primary:hover { background: #d94800; }
        .button.secondary { border-color: #fff; background: transparent; color: #fff; }
        .button.secondary:hover { background: #fff; color: #0b0b0b; }
        .button:focus-visible { outline: 2px solid #f25a0a; outline-offset: 3px; }
        footer {
            border-top: 1px solid #292929;
            padding: 0.875rem 1.25rem calc(0.875rem + env(safe-area-inset-bottom));
            color: #71717a;
            font-size: 0.75rem;
            text-align: center;
        }
        @media (max-width: 640px) {
            .actions { flex-direction: column; }
            .button { width: 100%; }
        }
    </style>
</head>
<body data-error-page="{{ $status }}">
    @if ($status !== 404)
        <header class="top">
            <a class="wordmark" href="{{ $homeUrl }}">SPORTS<span>35</span></a>
        </header>
    @endif
    <main>
        <div class="content">
            <p class="code">{{ $status }}</p>
            <h1>{{ $title }}</h1>
            <p class="message">{{ $message }}</p>
            @if ($seconds)
                <p class="hint">{{ __('public.error_pages.retry_after', ['seconds' => $seconds]) }}</p>
            @endif
            <div class="actions">
                @if ($loginUrl)
                    <a class="button primary" href="{{ $loginUrl }}">{{ __('public.error_pages.login') }}</a>
                    <a class="button secondary" href="{{ $homeUrl }}">{{ __('public.error_pages.home') }}</a>
                @elseif ($status === 419)
                    <button class="button primary" type="button" data-home="{{ $homeUrl }}" onclick="if (history.length > 1) { history.back(); } else { window.location.href = this.dataset.home; }">{{ __('public.error_pages.back') }}</button>
                    <a class="button secondary" href="{{ $homeUrl }}">{{ __('public.error_pages.home') }}</a>
                @elseif ($showRetry)
                    <button class="button primary" type="button" onclick="window.location.reload()">{{ __('public.error_pages.retry') }}</button>
                    <a class="button secondary" href="{{ $homeUrl }}">{{ __('public.error_pages.home') }}</a>
                @else
                    <a class="button primary" href="{{ $homeUrl }}">{{ __('public.error_pages.home') }}</a>
                    <button class="button secondary" type="button" data-home="{{ $homeUrl }}" onclick="if (history.length > 1) { history.back(); } else { window.location.href = this.dataset.home; }">{{ __('public.error_pages.back') }}</button>
                @endif
            </div>
        </div>
    </main>
    <footer>© {{ now()->year }} {{ $appName }}</footer>
</body>
</html>
