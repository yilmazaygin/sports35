<?php

namespace Database\Seeders;

use App\Models\GalleryCategory;
use App\Models\SiteSetting;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class Phase2Seeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name_tr' => 'Salon İçi', 'name_en' => 'Gym Interior', 'sort_order' => 1],
            ['name_tr' => 'Yarışmacılarımız', 'name_en' => 'Our Athletes', 'sort_order' => 2],
            ['name_tr' => 'Üyelerimiz', 'name_en' => 'Our Members', 'sort_order' => 3],
        ];

        foreach ($categories as $cat) {
            GalleryCategory::updateOrCreate(
                ['slug' => Str::slug($cat['name_tr'])],
                array_merge($cat, ['slug' => Str::slug($cat['name_tr'])]),
            );
        }

        $settings = [
            'contact.phone' => '+90 500 000 00 00',
            'contact.whatsapp' => '905000000000',
            'contact.email' => 'info@sports35.test',
            'contact.address_tr' => 'İzmir, Türkiye',
            'contact.address_en' => 'Izmir, Turkey',
            'social.facebook' => 'https://facebook.com/sports35',
            'social.instagram' => 'https://instagram.com/sports35',
            'contact.maps_embed' => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3125.0!2d27.1428!3d38.4237!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzjCsDI1JzI1LjMiTiAyN8KwMDgnMzQuMSJF!5e0!3m2!1str!2str!4v1234567890',
        ];

        foreach ($settings as $key => $value) {
            SiteSetting::set($key, $value);
        }
    }
}
