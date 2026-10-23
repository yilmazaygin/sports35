<?php

namespace Tests\Feature;

use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BrandSettingsTest extends TestCase
{
    use RefreshDatabase;

    public function test_owner_connects_a_new_social_account_from_brand_settings(): void
    {
        $owner = User::factory()->create();

        $this->actingAs($owner)->put('/admin/site-settings', [
            'phone' => '+90 555 000 00 00',
            'whatsapp' => '905550000000',
            'email' => 'salon@sports35.test',
            'address_tr' => 'İzmir',
            'address_en' => 'Izmir',
            'maps_embed' => 'https://www.google.com/maps/embed?pb=sports35',
            'maps_url' => 'https://maps.app.goo.gl/29SnkyHCmTvT7PWQ7',
            'social_accounts' => [
                ['platform' => 'instagram', 'url' => 'https://instagram.com/sports35'],
                ['platform' => 'tiktok', 'url' => 'https://www.tiktok.com/@sports35'],
                ['platform' => 'linkedin', 'url' => ''],
            ],
            'video_audio' => false,
        ])->assertRedirect();

        $contact = SiteSetting::contact();

        $this->assertSame('+90 555 000 00 00', $contact['phone']);
        $this->assertCount(2, $contact['social_accounts']);
        $this->assertSame('instagram', $contact['social_accounts'][0]['platform']);
        $this->assertSame('tiktok', $contact['social_accounts'][1]['platform']);
        $this->assertSame('https://www.tiktok.com/@sports35', $contact['social_accounts'][1]['url']);
        $this->assertSame('https://maps.app.goo.gl/29SnkyHCmTvT7PWQ7', $contact['maps_url']);
        $this->assertSame('https://www.google.com/maps/embed?pb=sports35', $contact['maps_embed']);

        $this->get('/')->assertOk()->assertInertia(fn ($page) => $page
            ->where('contact.social_accounts.1.name', 'TikTok')
            ->where('contact.phone', '+90 555 000 00 00')
            ->where('contact.maps_url', 'https://maps.app.goo.gl/29SnkyHCmTvT7PWQ7')
            ->has('whyUs.items', 4)
            ->missing('whyUs.programs')
        );
    }

    public function test_owner_sets_the_four_homepage_reasons(): void
    {
        $owner = User::factory()->create();
        $whyUs = SiteSetting::whyUs();
        $whyUs['items'][0]['icon'] = 'shield';
        $whyUs['items'][0]['title_tr'] = 'Güvenli alan';
        $whyUs['paragraph_tr'] = 'Sports35 temiz, bakımlı ve düzenli bir salon deneyimi sunar.';

        $this->actingAs($owner)->put('/admin/site-settings', [
            'phone' => '+90 555 000 00 00',
            'whatsapp' => '905550000000',
            'email' => 'salon@sports35.test',
            'social_accounts' => [],
            'video_audio' => false,
            'why_us' => $whyUs,
        ])->assertRedirect();

        $this->assertCount(4, SiteSetting::whyUs()['items']);
        $this->get('/')->assertOk()->assertInertia(fn ($page) => $page
            ->has('whyUs.items', 4)
            ->where('whyUs.items.0.icon', 'shield')
            ->where('whyUs.items.0.title', 'Güvenli alan')
            ->where('whyUs.paragraph', 'Sports35 temiz, bakımlı ve düzenli bir salon deneyimi sunar.')
        );
    }

    public function test_a_coordinate_pin_is_replaced_by_the_sports35_business(): void
    {
        SiteSetting::set(
            'contact.maps_embed',
            'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d600.0!2d27.148489!3d38.390258!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzjCsDIzJzI0LjkiTiAyN8KwMDgnNTQuNiJF!5e0!3m2!1str!2str!4v1234567890',
        );

        $contact = SiteSetting::contact();

        $this->assertSame(SiteSetting::MAPS_EMBED, $contact['maps_embed']);
        $this->assertStringContainsString('0x14bbd8caeadf77cb', $contact['maps_embed']);
        $this->assertSame(SiteSetting::MAPS_URL, $contact['maps_url']);
    }

    public function test_homepage_copy_speaks_as_the_brand(): void
    {
        $whyUs = SiteSetting::whyUs();

        $this->assertLessThanOrEqual(1000, mb_strlen($whyUs['paragraph_tr']));
        $this->assertLessThanOrEqual(1000, mb_strlen($whyUs['paragraph_en']));

        foreach ($whyUs['items'] as $item) {
            $this->assertLessThanOrEqual(80, mb_strlen($item['title_tr']));
            $this->assertLessThanOrEqual(80, mb_strlen($item['title_en']));
            $this->assertLessThanOrEqual(240, mb_strlen($item['body_tr']));
            $this->assertLessThanOrEqual(240, mb_strlen($item['body_en']));
        }

        $english = SiteSetting::whyUsForLocale('en');
        $this->assertStringContainsString('Sports35 is a gym in Buca, İzmir', $english['paragraph']);
        $this->assertStringNotContainsString('Spor 35', $english['paragraph']);
        $this->assertStringNotContainsString('Şirinyer gym', $english['paragraph']);
        $this->assertStringNotContainsString('Buca gym', $english['paragraph']);

        $this->get('/')
            ->assertOk()
            ->assertSee('Sports35, İzmir’in Buca ilçesinde yer alan spor salonudur.', false)
            ->assertInertia(fn ($page) => $page
                ->where('whyUs.paragraph', fn (string $paragraph) => str_contains($paragraph, 'Sports35, İzmir’in Buca ilçesinde')
                    && str_contains($paragraph, 'yer alan bir spor salonudur')
                    && ! str_contains($paragraph, 'en temiz')
                    && ! str_contains($paragraph, 'Spor 35')
                    && ! str_contains($paragraph, 'Buca spor salonu')
                    && ! str_contains($paragraph, 'Şirinyer spor salonu')
                    && ! str_contains($paragraph, 'İzmir spor salonu'))
                ->where('whyUs.items.0.body', 'Antrenman alanları düzenli olarak temizlenir.')
                ->where('whyUs.items.1.body', 'Bakımlı makineler ve serbest ağırlıklar kullanıma hazırdır.')
                ->where('whyUs.items.2.body', 'Günün büyük bölümünde salona gelebilirsiniz.')
                ->where('translations.public.services.subtitle', 'Sports35’i farklı kılan olanaklar.')
                ->where('translations.public.facility_section.subtitle', 'Kardiyo, kuvvet ve serbest ağırlık alanlarını yakından inceleyin.')
                ->where('translations.public.hours.subtitle', 'Sports35’in haftalık açık olduğu saatler.')
                ->where('translations.public.location_section.subtitle', 'İzmir Buca’da, Şirinyer’deyiz. Adres, telefon ve sosyal hesaplar.')
            );
    }
}
