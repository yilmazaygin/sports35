<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteSetting extends Model
{
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
    }

    public static function contact(): array
    {
        return [
            'phone' => static::get('contact.phone', '+90 500 000 00 00'),
            'whatsapp' => static::get('contact.whatsapp', '905000000000'),
            'email' => static::get('contact.email', 'info@sports35.test'),
            'address_tr' => static::get('contact.address_tr', 'İzmir, Türkiye'),
            'address_en' => static::get('contact.address_en', 'Izmir, Turkey'),
            'facebook' => static::get('social.facebook', ''),
            'instagram' => static::get('social.instagram', ''),
            'maps_embed' => static::get('contact.maps_embed', ''),
        ];
    }
}
