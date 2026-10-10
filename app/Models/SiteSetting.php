<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class SiteSetting extends Model
{
    private const CONTACT_CACHE_KEY = 'site_settings.contact';

    private static ?array $contactCache = null;

    private const CONTACT_DEFAULTS = [
        'phone' => '+90 500 000 00 00',
        'whatsapp' => '905000000000',
        'email' => 'info@sports35.test',
        'address_tr' => 'İzmir, Türkiye',
        'address_en' => 'Izmir, Turkey',
        'facebook' => '',
        'instagram' => '',
        'maps_embed' => '',
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
                'contact.maps_embed',
            ];

            $values = static::query()
                ->whereIn('key', $keys)
                ->pluck('value', 'key');

            return [
                'phone' => $values->get('contact.phone', self::CONTACT_DEFAULTS['phone']),
                'whatsapp' => $values->get('contact.whatsapp', self::CONTACT_DEFAULTS['whatsapp']),
                'email' => $values->get('contact.email', self::CONTACT_DEFAULTS['email']),
                'address_tr' => $values->get('contact.address_tr', self::CONTACT_DEFAULTS['address_tr']),
                'address_en' => $values->get('contact.address_en', self::CONTACT_DEFAULTS['address_en']),
                'facebook' => $values->get('social.facebook', self::CONTACT_DEFAULTS['facebook']),
                'instagram' => $values->get('social.instagram', self::CONTACT_DEFAULTS['instagram']),
                'maps_embed' => $values->get('contact.maps_embed', self::CONTACT_DEFAULTS['maps_embed']),
            ];
        });

        return self::$contactCache;
    }
}
