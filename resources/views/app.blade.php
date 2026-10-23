<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
        <meta name="theme-color" content="#0a0a0a">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        @inertiaHead

        @unless ($__inertiaSsrResponse ?? false)
            <title inertia>{{ $publicSeo['document_title'] }}</title>

            @if ($publicSeo['indexable'])
                <meta head-key="description" name="description" content="{{ $publicSeo['description'] }}">
                <link head-key="canonical" rel="canonical" href="{{ $publicSeo['canonical'] }}">
                @foreach ($publicSeo['alternates'] as $alternate)
                    <link rel="alternate" hreflang="{{ $alternate['hreflang'] }}" href="{{ $alternate['href'] }}">
                @endforeach
                <meta head-key="robots" name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
                <meta head-key="og:type" property="og:type" content="{{ $publicSeo['og_type'] }}">
                <meta head-key="og:site_name" property="og:site_name" content="{{ $publicSeo['site_name'] }}">
                <meta head-key="og:locale" property="og:locale" content="{{ $publicSeo['locale'] }}">
                <meta head-key="og:locale:alternate" property="og:locale:alternate" content="{{ $publicSeo['locale_alternate'] }}">
                <meta head-key="og:title" property="og:title" content="{{ $publicSeo['document_title'] }}">
                <meta head-key="og:description" property="og:description" content="{{ $publicSeo['description'] }}">
                <meta head-key="og:url" property="og:url" content="{{ $publicSeo['canonical'] }}">
                @if ($publicSeo['image'] !== '')
                    <meta head-key="og:image" property="og:image" content="{{ $publicSeo['image'] }}">
                    <meta head-key="og:image:alt" property="og:image:alt" content="{{ $publicSeo['document_title'] }}">
                    <meta name="twitter:card" content="summary_large_image">
                    <meta name="twitter:image" content="{{ $publicSeo['image'] }}">
                @endif
            @endif
        @endunless

        @if ($publicSeo['indexable'])
            <link rel="alternate" type="text/plain" href="{{ $publicSeo['llms'] }}" title="LLMs">
            <script type="application/ld+json">{!! json_encode($publicSeo['json_ld'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP) !!}</script>
        @else
            <meta name="robots" content="noindex, nofollow">
        @endif

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=inter:400,500,600,700,800,900|figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
    </head>
    <body class="font-sans antialiased">
        @if ($__inertiaSsrResponse ?? false)
            {!! $__inertiaSsrResponse->body !!}
        @else
            @php($snapshot = trim(view('seo.snapshot', ['page' => $page])->render()))
            <div id="app" data-page="{{ json_encode($page) }}" @if ($snapshot !== '') data-snapshot="1" @endif>{!! $snapshot !!}</div>
        @endif
    </body>
</html>
