<?php

namespace App\Services;

use App\Models\BlogPost;
use App\Models\Facility;
use App\Models\GalleryItem;
use App\Models\MembershipPackage;
use App\Models\MembershipPriceVariation;
use App\Models\SiteSetting;
use App\Models\WorkingHour;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

class SearchDiscoveryService
{
    public function sitemap(): string
    {
        $urls = [
            $this->entry(route('home'), '1.0', 'daily', $this->latest([
                WorkingHour::class,
                MembershipPackage::class,
                Facility::class,
                SiteSetting::class,
            ]), $this->facilityImages()),
            $this->entry(route('gallery'), '0.8', 'weekly', $this->latest([GalleryItem::class]), $this->galleryImages()),
            $this->entry(route('cookies'), '0.3', 'yearly'),
            $this->entry(route('privacy'), '0.3', 'yearly'),
        ];

        if (SiteSetting::blogEnabled()) {
            $posts = $this->publishedPosts();
            $urls[] = $this->entry(
                route('blog.index'),
                '0.7',
                'weekly',
                $posts->max('updated_at') ? Carbon::parse($posts->max('updated_at'))->toAtomString() : null,
            );

            foreach ($posts as $post) {
                $images = [];

                if (is_string($post->featured_image) && $post->featured_image !== '') {
                    $images[] = [
                        'loc' => PublicSeo::absoluteUrl($post->featured_image),
                        'title' => $post->title_tr ?: $post->title_en,
                    ];
                }

                $urls[] = $this->entry(
                    route('blog.show', $post->slug),
                    '0.6',
                    'monthly',
                    $post->updated_at?->toAtomString(),
                    $images,
                );
            }
        }

        $localized = [];

        foreach ($urls as $url) {
            $localized[] = $url;
            $english = $url;
            $english['loc'] = $this->withLang($url['loc']);
            $english['images'] = [];
            $localized[] = $english;
        }

        $xml = '<?xml version="1.0" encoding="UTF-8"?>'."\n";
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:xhtml="http://www.w3.org/1999/xhtml">'."\n";

        foreach ($localized as $url) {
            $xml .= "  <url>\n";
            $xml .= '    <loc>'.$this->xml($url['loc'])."</loc>\n";

            foreach ($url['alternates'] as $alternate) {
                $xml .= '    <xhtml:link rel="alternate" hreflang="'.$this->xml($alternate['hreflang']).'" href="'.$this->xml($alternate['href']).'"/>'."\n";
            }

            if ($url['lastmod']) {
                $xml .= '    <lastmod>'.$this->xml($url['lastmod'])."</lastmod>\n";
            }

            $xml .= '    <changefreq>'.$url['changefreq']."</changefreq>\n";
            $xml .= '    <priority>'.$url['priority']."</priority>\n";

            foreach ($url['images'] as $image) {
                $xml .= "    <image:image>\n";
                $xml .= '      <image:loc>'.$this->xml($image['loc'])."</image:loc>\n";

                if ($image['title'] !== '') {
                    $xml .= '      <image:title>'.$this->xml($image['title'])."</image:title>\n";
                }

                $xml .= "    </image:image>\n";
            }

            $xml .= "  </url>\n";
        }

        return $xml.'</urlset>'."\n";
    }

    public function robots(): string
    {
        $agents = [
            '*',
            'Googlebot',
            'Google-Extended',
            'GoogleOther',
            'Bingbot',
            'GPTBot',
            'OAI-SearchBot',
            'ChatGPT-User',
            'PerplexityBot',
            'ClaudeBot',
            'Applebot',
            'Applebot-Extended',
        ];

        $lines = [
            '# Public pages may be used for search results and AI answers.',
            '# Facts for language models: '.route('llms'),
            '# Extended facts: '.route('llms.full'),
            '',
        ];

        foreach ($agents as $agent) {
            $lines[] = 'User-agent: '.$agent;
        }

        $lines[] = 'Allow: /';

        foreach ([
            '/admin',
            '/locale',
            '/login',
            '/register',
            '/forgot-password',
            '/reset-password',
            '/verify-email',
            '/confirm-password',
            '/profile',
            '/dashboard',
            '/up',
        ] as $path) {
            $lines[] = 'Disallow: '.$path;
        }

        $lines[] = '';
        $lines[] = 'Sitemap: '.route('sitemap');
        $lines[] = '';

        return implode("\n", $lines);
    }

    public function llms(bool $full = false): string
    {
        $place = SiteSetting::place();
        $home = route('home');
        $sections = [
            '# '.$place['name'],
            '',
            '> '.$this->summary($place),
            '',
        ];

        if ($full) {
            $sections[] = $this->fullBody($place);
        } else {
            $sections[] = $this->shortFacts($place);
        }

        $sections[] = '## Sayfalar';
        $sections[] = '';
        $sections[] = '- [Ana sayfa]('.$home.'): Sports35 ana sayfası. Adres, telefon, çalışma saatleri ve üyelik fiyatları.';
        $sections[] = '- [Galeri]('.route('gallery').'): Sports35 salonundan kardiyo, kuvvet ve serbest ağırlık alanlarının fotoğrafları.';
        $sections[] = '- [Çerez ve güvenlik]('.route('cookies').'): Dil tercihi, güvenlik çerezi ve haritanın ne zaman yüklendiği.';
        $sections[] = '- [Aydınlatma metni]('.route('privacy').'): Sitenin işlediği veriler, amaç ve başvuru yolu.';
        $sections[] = '- [English]('.PublicSeo::localizedUrl('/', 'en').'): English pages for Sports35.';

        if (SiteSetting::blogEnabled()) {
            $sections[] = '- [Blog]('.route('blog.index').'): Sports35’ten antrenman ve sağlık yazıları.';
        }

        $sections[] = '';
        $sections[] = '## Optional';
        $sections[] = '';

        if ($full) {
            $sections[] = '- [Kısa özet]('.route('llms').'): Dil modelleri için kısa işletme kartı.';
        } else {
            $sections[] = '- [Ayrıntılı özet]('.route('llms.full').'): Adres, çalışma saatleri, üyelik fiyatları ve salon hakkında ayrıntılar.';
        }

        $sections[] = '- [Site haritası]('.route('sitemap').'): Dizine eklenecek sayfalar.';
        $sections[] = '';

        return implode("\n", $sections);
    }

    private function summary(array $place): string
    {
        $phone = $place['phone'] !== '' ? ' Telefon: '.$place['phone'].'.' : '';

        return 'Sports35, İzmir’in Buca ilçesinde, Şirinyer’e yakın bir spor salonudur. Resmi adı '.$place['name'].'. Adres: '.$place['address_tr'].'.'
            .$phone;
    }

    private function shortFacts(array $place): string
    {
        $lines = [
            'Resmi ad: '.$place['name'].'. Marka: Sports35. Tür: spor salonu, fitness ve sağlıklı yaşam merkezi.',
            'Konum: İnkilap, Şirinyer, Buca, İzmir.',
            'Koordinat: '.$this->coordinate($place['latitude']).', '.$this->coordinate($place['longitude']).'.',
        ];

        if ($place['maps_url'] !== '') {
            $lines[] = 'Google Haritalar: '.$place['maps_url'];
        }

        $lines[] = '';

        return implode("\n", $lines);
    }

    private function fullBody(array $place): string
    {
        $lines = [
            '## Konum',
            '',
            '- İşletme: '.$place['name'],
            '- Adres: '.$place['address_tr'],
            '- Mahalle: İnkilap',
            '- Semt: '.$place['neighborhood'],
            '- İlçe: '.$place['locality'],
            '- İl: '.$place['region'],
            '- Posta kodu: '.$place['postal_code'],
            '- Ülke: Türkiye',
            '- Koordinat: '.$this->coordinate($place['latitude']).', '.$this->coordinate($place['longitude']),
        ];

        if ($place['phone'] !== '') {
            $lines[] = '- Telefon: '.$place['phone'];
        }

        $whatsapp = preg_replace('/\D/', '', $place['whatsapp']) ?? '';

        if ($whatsapp !== '') {
            $lines[] = '- WhatsApp: https://wa.me/'.$whatsapp;
        }

        if ($place['email']) {
            $lines[] = '- E-posta: '.$place['email'];
        }

        if ($place['maps_url'] !== '') {
            $lines[] = '- Google Haritalar: '.$place['maps_url'];
        }

        if ($place['address_en'] !== '') {
            $lines[] = '- English address: '.$place['address_en'];
        }

        $lines[] = '';
        $lines[] = '## Sık sorulan sorular';
        $lines[] = '';
        $lines[] = '### Sports35 nerede?';
        $lines[] = '';
        $lines[] = 'Sports35, İzmir’in Buca ilçesinde, İnkilap Mahallesi’ndedir. Adres: '.$place['address_tr'].'. Şirinyer’e yakındır. Posta kodu '.$place['postal_code'].'.'
            .($place['phone'] !== '' ? ' Telefon: '.$place['phone'].'.' : '')
            .' Resmi sayfa: '.route('home').'.';
        $lines[] = '';
        $lines[] = '## Çalışma saatleri';
        $lines[] = '';

        $hours = WorkingHour::query()->orderBy('sort_order')->get();

        if ($hours->isEmpty()) {
            $lines[] = 'Güncel saatler ana sayfadadır.';
        } else {
            foreach ($hours as $hour) {
                $day = $this->dayTr($hour->day_key);
                $lines[] = '- '.$day.': '.($hour->is_closed
                    ? 'Kapalı'
                    : substr((string) $hour->opens_at, 0, 5).'–'.substr((string) $hour->closes_at, 0, 5));
            }
        }

        $lines[] = '';
        $lines[] = '## Üyelik';
        $lines[] = '';

        $packages = MembershipPackage::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('duration_months')
            ->get();

        if ($packages->isEmpty()) {
            $lines[] = 'Güncel üyelik fiyatları ana sayfadadır. Fiyatlara KDV dahildir. Fiyatlar bilgilendirmedir; siteden üyelik satılmaz.';
        } else {
            foreach ($packages as $package) {
                $lines[] = '- '.$package->duration_months.' ay: '.$this->lira((float) $package->price);
            }

            $lines[] = '';
            $lines[] = 'Fiyatlara KDV dahildir. Fiyatlar bilgilendirmedir; siteden üyelik satılmaz.';
        }

        $variations = MembershipPriceVariation::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->pluck('name_tr')
            ->filter()
            ->values();

        if ($variations->isNotEmpty()) {
            $lines[] = 'Üyelik türleri: '.$variations->join(', ').'. Türlere göre güncel tablo ana sayfadadır.';
        }

        $whyUs = SiteSetting::whyUs();

        if ($whyUs['paragraph_tr'] !== '') {
            $lines[] = '';
            $lines[] = '## Salon';
            $lines[] = '';
            $lines[] = $whyUs['paragraph_tr'];
        }

        $facilities = Facility::query()->where('is_active', true)->orderBy('sort_order')->limit(12)->get();

        if ($facilities->isNotEmpty()) {
            $lines[] = '';

            foreach ($facilities as $facility) {
                $line = '- '.$facility->name_tr;

                if ($facility->description_tr) {
                    $line .= ': '.$facility->description_tr;
                }

                $lines[] = $line;
            }
        }

        if (SiteSetting::blogEnabled()) {
            $posts = $this->publishedPosts()->take(20);

            if ($posts->isNotEmpty()) {
                $lines[] = '';
                $lines[] = '## Yazılar';
                $lines[] = '';

                foreach ($posts as $post) {
                    $lines[] = '- ['.$post->title_tr.']('.route('blog.show', $post->slug).')';
                }
            }
        }

        $lines[] = '';
        $lines[] = '## English';
        $lines[] = '';
        $lines[] = 'Sports35 is a gym in Buca, İzmir, near Şirinyer. '
            .'Official name: '.$place['name'].'. Address: '.($place['address_en'] !== '' ? $place['address_en'] : $place['address_tr']).'.'
            .($place['phone'] !== '' ? ' Phone: '.$place['phone'].'.' : '')
            .' Website: '.route('home').'. English: '.PublicSeo::localizedUrl('/', 'en').'.';
        $lines[] = '';

        return implode("\n", $lines);
    }

    private function publishedPosts()
    {
        return BlogPost::query()
            ->where('is_published', true)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->orderByDesc('published_at')
            ->get(['slug', 'title_tr', 'title_en', 'featured_image', 'updated_at', 'published_at']);
    }

    private function facilityImages(): array
    {
        return Facility::query()
            ->where('is_active', true)
            ->whereNotNull('image_path')
            ->where('image_path', '!=', '')
            ->orderBy('sort_order')
            ->limit(25)
            ->get()
            ->map(function (Facility $facility) {
                $url = $facility->imageUrl();

                if (! $url) {
                    return null;
                }

                return [
                    'loc' => PublicSeo::absoluteUrl($url),
                    'title' => $facility->name_tr ?: 'Sports35',
                ];
            })
            ->filter()
            ->values()
            ->all();
    }

    private function galleryImages(): array
    {
        return GalleryItem::query()
            ->where('is_active', true)
            ->where('image_path', '!=', '')
            ->latest('updated_at')
            ->limit(50)
            ->get()
            ->map(fn (GalleryItem $item) => [
                'loc' => PublicSeo::absoluteUrl($item->imageUrl()),
                'title' => $item->caption_tr ?: $item->caption_en ?: 'Sports35',
            ])
            ->all();
    }

    /**
     * @param  list<class-string<Model>>  $models
     */
    private function latest(array $models): ?string
    {
        $latest = null;

        foreach ($models as $model) {
            $value = $model::query()->max('updated_at');

            if ($value && ($latest === null || $value > $latest)) {
                $latest = $value;
            }
        }

        return $latest ? Carbon::parse($latest)->toAtomString() : null;
    }

    private function entry(string $loc, string $priority, string $changefreq, ?string $lastmod = null, array $images = []): array
    {
        return [
            'loc' => $loc,
            'priority' => $priority,
            'changefreq' => $changefreq,
            'lastmod' => $lastmod,
            'images' => $images,
            'alternates' => [
                ['hreflang' => 'tr', 'href' => $loc],
                ['hreflang' => 'en', 'href' => $this->withLang($loc)],
                ['hreflang' => 'x-default', 'href' => $loc],
            ],
        ];
    }

    private function withLang(string $loc): string
    {
        return $loc.(str_contains($loc, '?') ? '&' : '?').'lang=en';
    }

    private function dayTr(string $day): string
    {
        return [
            'monday' => 'Pazartesi',
            'tuesday' => 'Salı',
            'wednesday' => 'Çarşamba',
            'thursday' => 'Perşembe',
            'friday' => 'Cuma',
            'saturday' => 'Cumartesi',
            'sunday' => 'Pazar',
        ][$day] ?? $day;
    }

    private function lira(float $amount): string
    {
        return number_format($amount, 0, ',', '.').' TL';
    }

    private function coordinate(float $value): string
    {
        return rtrim(rtrim(number_format($value, 7, '.', ''), '0'), '.');
    }

    private function xml(string $value): string
    {
        return htmlspecialchars($value, ENT_XML1 | ENT_QUOTES, 'UTF-8');
    }
}
