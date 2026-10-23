<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class SiteSetting extends Model
{
    private const CONTACT_CACHE_KEY = 'site_settings.contact.v4';

    private const VIDEO_AUDIO_CACHE_KEY = 'site_settings.hero_video_audio';

    private const BLOG_ENABLED_CACHE_KEY = 'site_settings.blog_enabled';

    private const WHY_US_CACHE_KEY = 'site_settings.why_us';

    public const WHY_US_ICONS = ['broom', 'sparkle', 'equipment', 'dumbbell', 'clock', 'users', 'shield'];

    public const SOCIAL_PLATFORMS = [
        'instagram' => 'Instagram',
        'facebook' => 'Facebook',
        'twitter' => 'Twitter',
        'linkedin' => 'LinkedIn',
        'tiktok' => 'TikTok',
    ];

    public const BUSINESS_NAME = 'Sports35 Fitness ve Sağlıklı Yaşam Merkezi';

    public const LATITUDE = 38.3902341;

    public const LONGITUDE = 27.1484883;

    public const LOCALITY = 'Buca';

    public const REGION = 'İzmir';

    public const POSTAL_CODE = '35380';

    public const STREET_ADDRESS = 'İnkilap, 504/2. Sk. 3B D:1';

    public const NEIGHBORHOOD = 'Şirinyer';

    public const MAPS_URL = 'https://maps.app.goo.gl/29SnkyHCmTvT7PWQ7';

    public const MAPS_EMBED = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d600!2d27.1484883!3d38.3902341!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14bbd8caeadf77cb%3A0x9cf4cf5362ba9b3a!2sSports35%20Fitness%20ve%20Sa%C4%9Fl%C4%B1kl%C4%B1%20Ya%C5%9Fam%20Merkezi!5e0!3m2!1str!2str!4v1729641600000!5m2!1str!2str';

    private static ?array $contactCache = null;

    private const CONTACT_DEFAULTS = [
        'phone' => '+90 505 930 30 07',
        'whatsapp' => '905059303007',
        'email' => '',
        'address_tr' => 'İnkilap, 504/2. Sk. 3B D:1, 35380 Buca/İzmir',
        'address_en' => 'İnkilap, 504/2. Sk. 3B D:1, 35380 Buca/İzmir, Turkey',
        'facebook' => '',
        'instagram' => '',
        'maps_embed' => self::MAPS_EMBED,
        'maps_url' => self::MAPS_URL,
    ];

    public $incrementing = false;

    protected $primaryKey = 'key';

    protected $keyType = 'string';

    protected $fillable = ['key', 'value'];

    public static function get(string $key, mixed $default = null): mixed
    {
        return static::query()->find($key)?->value ?? $default;
    }

    public static function set(string $key, mixed $value): void
    {
        static::updateOrCreate(['key' => $key], ['value' => $value]);
        self::$contactCache = null;
        Cache::forget(self::CONTACT_CACHE_KEY);
        Cache::forget(self::VIDEO_AUDIO_CACHE_KEY);
        Cache::forget(self::BLOG_ENABLED_CACHE_KEY);
        Cache::forget(self::WHY_US_CACHE_KEY);
    }

    public static function videoAudioEnabled(): bool
    {
        return Cache::rememberForever(self::VIDEO_AUDIO_CACHE_KEY, function (): bool {
            return static::get('video_audio', '0') === '1';
        });
    }

    public static function whyUs(): array
    {
        return Cache::rememberForever(self::WHY_US_CACHE_KEY, function (): array {
            $stored = static::get('home.why_us');
            $decoded = is_string($stored) ? json_decode($stored, true) : null;

            return self::normalizeWhyUs(is_array($decoded) ? $decoded : []);
        });
    }

    public static function whyUsForLocale(?string $locale = null): array
    {
        $data = self::whyUs();
        $english = ($locale ?? app()->getLocale()) === 'en';

        return [
            'paragraph' => $english ? $data['paragraph_en'] : $data['paragraph_tr'],
            'items' => array_map(fn (array $item) => [
                'icon' => $item['icon'],
                'title' => $english ? $item['title_en'] : $item['title_tr'],
                'body' => $english ? $item['body_en'] : $item['body_tr'],
            ], $data['items']),
        ];
    }

    public static function normalizeWhyUs(array $data): array
    {
        $defaults = self::whyUsDefaults();
        $items = [];

        foreach (range(0, 3) as $index) {
            $item = $data['items'][$index] ?? [];
            $fallback = $defaults['items'][$index];
            $icon = $item['icon'] ?? $fallback['icon'];

            $items[] = [
                'icon' => in_array($icon, self::WHY_US_ICONS, true) ? $icon : $fallback['icon'],
                'title_tr' => self::whyUsText($item['title_tr'] ?? null, $fallback['title_tr']),
                'title_en' => self::whyUsText($item['title_en'] ?? null, $fallback['title_en']),
                'body_tr' => self::whyUsText($item['body_tr'] ?? null, $fallback['body_tr']),
                'body_en' => self::whyUsText($item['body_en'] ?? null, $fallback['body_en']),
            ];
        }

        return [
            'paragraph_tr' => self::whyUsText($data['paragraph_tr'] ?? null, $defaults['paragraph_tr']),
            'paragraph_en' => self::whyUsText($data['paragraph_en'] ?? null, $defaults['paragraph_en']),
            'items' => $items,
        ];
    }

    private static function whyUsText(mixed $value, string $fallback): string
    {
        $text = trim((string) $value);

        return $text === '' ? $fallback : $text;
    }

    private static function whyUsDefaults(): array
    {
        return [
            'paragraph_tr' => 'Sports35, İzmir’in Buca ilçesinde yer alan bir spor salonudur. Antrenman alanları düzenli tutulur, ekipmanlar bakımlıdır ve salonun temposu hedefinize yer açar. Kardiyo, kuvvet ve serbest ağırlık alanları ayrıdır; antrenmanınız kesilmeden ilerler. Geniş çalışma saatleri, günün size uygun saatinde gelmenizi kolaylaştırır. İlk gününüzde ekibimiz, hedefinize uygun bir başlangıç için yanınızdadır.',
            'paragraph_en' => 'Sports35 is a gym in Buca, İzmir. Training areas stay tidy, the equipment is looked after, and the pace of the gym leaves room for your goal. Cardio, strength, and free-weight areas are separate, so a workout can continue without interruption. Long opening hours make it easier to come at a time that suits your day. On your first visit, the team helps you start in a way that matches your goal.',
            'items' => [
                [
                    'icon' => 'broom',
                    'title_tr' => 'Temiz salon',
                    'title_en' => 'Clean gym',
                    'body_tr' => 'Antrenman alanları düzenli olarak temizlenir.',
                    'body_en' => 'Training areas are cleaned on a regular schedule.',
                ],
                [
                    'icon' => 'dumbbell',
                    'title_tr' => 'Güncel ekipman',
                    'title_en' => 'Up-to-date equipment',
                    'body_tr' => 'Bakımlı makineler ve serbest ağırlıklar kullanıma hazırdır.',
                    'body_en' => 'Maintained machines and free weights are ready to use.',
                ],
                [
                    'icon' => 'clock',
                    'title_tr' => 'Geniş saatler',
                    'title_en' => 'Long hours',
                    'body_tr' => 'Günün büyük bölümünde salona gelebilirsiniz.',
                    'body_en' => 'You can come to the gym for most of the day.',
                ],
                [
                    'icon' => 'users',
                    'title_tr' => 'Yakın destek',
                    'title_en' => 'Personal support',
                    'body_tr' => 'Hedefinize uygun antrenman için ekibimiz yanınızdadır.',
                    'body_en' => 'The team is with you for training that fits your goal.',
                ],
            ],
        ];
    }

    public static function blogEnabled(): bool
    {
        return Cache::rememberForever(self::BLOG_ENABLED_CACHE_KEY, function (): bool {
            return static::get('blog.enabled', '1') === '1';
        });
    }

    public static function contact(): array
    {
        if (self::$contactCache !== null) {
            return self::$contactCache;
        }

        self::$contactCache = Cache::rememberForever(self::CONTACT_CACHE_KEY, function (): array {
            $keys = [
                'contact.phone',
                'contact.whatsapp',
                'contact.email',
                'contact.address_tr',
                'contact.address_en',
                'social.facebook',
                'social.instagram',
                'social.accounts',
                'contact.maps_embed',
                'contact.maps_url',
            ];

            $values = static::query()
                ->whereIn('key', $keys)
                ->pluck('value', 'key');

            $accounts = self::socialAccountsFrom($values);

            return [
                'phone' => $values->get('contact.phone', self::CONTACT_DEFAULTS['phone']),
                'whatsapp' => $values->get('contact.whatsapp', self::CONTACT_DEFAULTS['whatsapp']),
                'email' => self::publicEmail((string) $values->get('contact.email', self::CONTACT_DEFAULTS['email'])) ?? '',
                'address_tr' => $values->get('contact.address_tr', self::CONTACT_DEFAULTS['address_tr']),
                'address_en' => $values->get('contact.address_en', self::CONTACT_DEFAULTS['address_en']),
                'facebook' => self::accountUrl($accounts, 'Facebook') ?: $values->get('social.facebook', self::CONTACT_DEFAULTS['facebook']),
                'instagram' => self::accountUrl($accounts, 'Instagram') ?: $values->get('social.instagram', self::CONTACT_DEFAULTS['instagram']),
                'maps_embed' => self::mapEmbed($values->get('contact.maps_embed', self::CONTACT_DEFAULTS['maps_embed'])),
                'maps_url' => self::mapUrl($values->get('contact.maps_url', self::CONTACT_DEFAULTS['maps_url'])),
                'social_accounts' => $accounts,
            ];
        });

        return self::$contactCache;
    }

    public static function place(): array
    {
        $contact = self::contact();
        $address = trim((string) ($contact['address_tr'] ?? ''));
        $coordinates = self::coordinates((string) ($contact['maps_embed'] ?? ''));
        $postalCode = self::POSTAL_CODE;

        if (preg_match('/\b(\d{5})\b/u', $address, $matches) === 1) {
            $postalCode = $matches[1];
        }

        $street = str_contains($address, '504/2') || $address === ''
            ? self::STREET_ADDRESS
            : $address;

        return [
            'name' => self::BUSINESS_NAME,
            'short_name' => 'Sports35',
            'street' => $street,
            'address_tr' => $address !== '' ? $address : self::STREET_ADDRESS.', '.self::POSTAL_CODE.' '.self::LOCALITY.'/'.self::REGION,
            'address_en' => trim((string) ($contact['address_en'] ?? '')),
            'locality' => self::LOCALITY,
            'region' => self::REGION,
            'postal_code' => $postalCode,
            'neighborhood' => self::NEIGHBORHOOD,
            'latitude' => $coordinates['latitude'],
            'longitude' => $coordinates['longitude'],
            'phone' => trim((string) ($contact['phone'] ?? '')),
            'whatsapp' => trim((string) ($contact['whatsapp'] ?? '')),
            'email' => self::publicEmail((string) ($contact['email'] ?? '')),
            'maps_url' => trim((string) ($contact['maps_url'] ?? '')),
            'same_as' => array_values(array_filter(array_map(
                fn (array $account) => $account['url'] ?: null,
                $contact['social_accounts'] ?? [],
            ))),
        ];
    }

    public static function publicEmail(?string $email): ?string
    {
        $email = trim((string) $email);

        if ($email === '' || ! str_contains($email, '@')) {
            return null;
        }

        $host = strtolower(ltrim((string) strrchr($email, '@'), '@'));

        foreach (['test', 'local', 'invalid', 'example', 'localhost'] as $suffix) {
            if ($host === $suffix || str_ends_with($host, '.'.$suffix)) {
                return null;
            }
        }

        return $email;
    }

    /**
     * @return array{latitude: float, longitude: float}
     */
    public static function coordinates(string $embed): array
    {
        if (preg_match('/!2d(-?\d+(?:\.\d+)?)!3d(-?\d+(?:\.\d+)?)/', $embed, $matches) === 1) {
            return [
                'latitude' => (float) $matches[2],
                'longitude' => (float) $matches[1],
            ];
        }

        return [
            'latitude' => self::LATITUDE,
            'longitude' => self::LONGITUDE,
        ];
    }

    private static function mapEmbed(mixed $value): string
    {
        if (! is_string($value)) {
            return self::MAPS_EMBED;
        }

        $embed = trim($value);

        if ($embed === '') {
            return '';
        }

        if (str_contains($embed, '0x0%3A0x0') || str_contains($embed, '0x0:0x0')) {
            return self::MAPS_EMBED;
        }

        return $embed;
    }

    private static function mapUrl(mixed $value): string
    {
        $url = is_string($value) ? trim($value) : '';

        return $url !== '' ? $url : self::MAPS_URL;
    }

    public static function socialAccounts(): array
    {
        return self::contact()['social_accounts'];
    }

    public static function socialAccountForm(): array
    {
        $filled = collect(self::socialAccounts())->keyBy('platform');

        return collect(self::SOCIAL_PLATFORMS)
            ->map(fn (string $name, string $platform) => [
                'platform' => $platform,
                'url' => (string) data_get($filled->get($platform), 'url', ''),
            ])
            ->values()
            ->all();
    }

    public static function platformKey(string $value): ?string
    {
        $key = strtolower(trim($value));
        $key = str_replace([' ', '-', '_'], '', $key);
        $key = [
            'x' => 'twitter',
            'ig' => 'instagram',
            'fb' => 'facebook',
        ][$key] ?? $key;

        return array_key_exists($key, self::SOCIAL_PLATFORMS) ? $key : null;
    }

    private static function socialAccountsFrom($values): array
    {
        $stored = $values->get('social.accounts');
        $decoded = is_string($stored) ? json_decode($stored, true) : null;

        if (is_array($decoded)) {
            return self::normalizeAccounts($decoded);
        }

        return self::normalizeAccounts([
            ['name' => 'Facebook', 'url' => $values->get('social.facebook', self::CONTACT_DEFAULTS['facebook'])],
            ['name' => 'Instagram', 'url' => $values->get('social.instagram', self::CONTACT_DEFAULTS['instagram'])],
        ]);
    }

    private static function normalizeAccounts(array $accounts): array
    {
        $urls = [];

        foreach ($accounts as $account) {
            if (! is_array($account)) {
                continue;
            }

            $platform = self::platformKey((string) ($account['platform'] ?? $account['name'] ?? ''));
            $url = trim((string) ($account['url'] ?? ''));

            if ($platform !== null && $url !== '') {
                $urls[$platform] = $url;
            }
        }

        $normalized = [];

        foreach (self::SOCIAL_PLATFORMS as $platform => $name) {
            if (! isset($urls[$platform])) {
                continue;
            }

            $normalized[] = [
                'platform' => $platform,
                'name' => $name,
                'url' => $urls[$platform],
            ];
        }

        return $normalized;
    }

    private static function accountUrl(array $accounts, string $name): string
    {
        foreach ($accounts as $account) {
            if (strcasecmp($account['name'], $name) === 0) {
                return $account['url'];
            }
        }

        return '';
    }
}
