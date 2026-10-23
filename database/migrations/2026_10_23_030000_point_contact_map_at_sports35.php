<?php

use App\Models\SiteSetting;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $embed = DB::table('site_settings')->where('key', 'contact.maps_embed')->value('value');

        if (! is_string($embed) || $embed === '' || str_contains($embed, '0x0%3A0x0') || str_contains($embed, '0x0:0x0')) {
            SiteSetting::set('contact.maps_embed', SiteSetting::MAPS_EMBED);
        }

        $url = DB::table('site_settings')->where('key', 'contact.maps_url')->value('value');

        if (! is_string($url) || trim($url) === '') {
            SiteSetting::set('contact.maps_url', SiteSetting::MAPS_URL);
        }

        Cache::forget('site_settings.contact.v3');
        Cache::forget('site_settings.contact.v4');
    }

    public function down(): void
    {
        Cache::forget('site_settings.contact.v3');
        Cache::forget('site_settings.contact.v4');
    }
};
