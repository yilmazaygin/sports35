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
            GalleryCategory::query()->firstOrCreate(
                ['slug' => Str::slug($cat['name_tr'])],
                array_merge($cat, ['slug' => Str::slug($cat['name_tr'])]),
            );
        }

        $settings = [
            'contact.phone' => '+90 505 930 30 07',
            'contact.whatsapp' => '905059303007',
            'contact.address_tr' => 'İnkilap, 504/2. Sk. 3B D:1, 35380 Buca/İzmir',
            'contact.address_en' => 'İnkilap, 504/2. Sk. 3B D:1, 35380 Buca/İzmir, Turkey',
            'contact.maps_embed' => SiteSetting::MAPS_EMBED,
            'contact.maps_url' => SiteSetting::MAPS_URL,
            'video_audio' => '0',
        ];

        foreach ($settings as $key => $value) {
            if (SiteSetting::query()->where('key', $key)->exists()) {
                continue;
            }

            SiteSetting::set($key, $value);
        }
    }
}
