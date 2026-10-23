@php
    $component = $page['component'] ?? '';
    $props = $page['props'] ?? [];
@endphp

@if ($component === 'Public/Home')
    <main>
        <h1>{{ __('public.hero.title') }}</h1>
        <p>{{ __('public.hero.subtitle') }}</p>
        @if (! empty($props['whyUs']['items']))
            <section>
                <h2>{{ __('public.services.title') }}</h2>
                @foreach ($props['whyUs']['items'] as $item)
                    <h3>{{ $item['title'] ?? '' }}</h3>
                    @if (! empty($item['body']))
                        <p>{{ $item['body'] }}</p>
                    @endif
                @endforeach
                @if (! empty($props['whyUs']['paragraph']))
                    <p>{{ $props['whyUs']['paragraph'] }}</p>
                @endif
            </section>
        @endif
        @foreach ($props['facilities'] ?? [] as $facility)
            @if (! empty($facility['image_url']))
                <img src="{{ $facility['image_url'] }}" alt="{{ $facility['name'] ?: __('public.facility_section.title') }}">
            @endif
        @endforeach
    </main>
@elseif ($component === 'Public/Gallery/Index')
    <main>
        <h1>{{ __('public.gallery_page.title') }}</h1>
        <p>{{ __('public.gallery_page.subtitle') }}</p>
        @foreach ($props['items'] ?? [] as $item)
            @if (! empty($item['image_url']))
                <img src="{{ $item['image_url'] }}" alt="{{ $item['alt'] ?: ($item['caption'] ?: __('public.gallery_page.title')) }}">
            @endif
            @if (! empty($item['caption']))
                <p>{{ $item['caption'] }}</p>
            @endif
        @endforeach
    </main>
@elseif ($component === 'Public/Blog/Index')
    <main>
        <h1>{{ __('public.blog_page.title') }}</h1>
        @foreach ($props['posts'] ?? [] as $post)
            <article>
                @if (! empty($post['featured_image']))
                    <img src="{{ $post['featured_image'] }}" alt="{{ $post['title'] ?: __('public.seo.blog_title') }}">
                @endif
                <h2>{{ $post['title'] ?? '' }}</h2>
                @if (! empty($post['excerpt']))
                    <p>{{ $post['excerpt'] }}</p>
                @endif
            </article>
        @endforeach
    </main>
@elseif ($component === 'Public/Blog/Show')
    <article>
        <h1>{{ $props['post']['title'] ?? '' }}</h1>
        @if (! empty($props['post']['featured_image']))
            <img src="{{ $props['post']['featured_image'] }}" alt="{{ $props['post']['title'] ?: __('public.seo.blog_title') }}">
        @endif
        @if (! empty($props['post']['content']))
            {!! $props['post']['content'] !!}
        @endif
    </article>
@elseif ($component === 'Public/Cookies/Show')
    <article>
        <h1>{{ __('public.cookie_policy.title') }}</h1>
        <p>{{ __('public.cookie_policy.intro') }}</p>
        <h2>{{ __('public.cookie_policy.technical_title') }}</h2>
        <p>{{ __('public.cookie_policy.technical') }}</p>
        <h2>{{ __('public.cookie_policy.storage_title') }}</h2>
        <p>{{ __('public.cookie_policy.storage') }}</p>
    </article>
@elseif ($component === 'Error')
    @php
        $status = (int) ($props['status'] ?? 500);
        $known = [401, 403, 404, 419, 429, 500, 503];
        $key = in_array($status, $known, true) ? (string) $status : 'fallback';
    @endphp
    <main>
        <h1>{{ __("public.error_pages.{$key}.title") }}</h1>
        <p>{{ __("public.error_pages.{$key}.message") }}</p>
    </main>
@endif
