<?php

use App\Models\SiteSetting;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Cache;

return new class extends Migration
{
    private const OLD_PARAGRAPHS_TR = [
        'Sports35, İzmir’in Buca ilçesinde yer alan en temiz spor salonlarından biridir. Antrenman alanları düzenli tutulur, ekipmanlar bakımlıdır ve salonun temposu hedefinize yer açar. Kardiyo, kuvvet ve serbest ağırlık alanları ayrıdır; antrenmanınız kesilmeden ilerler. Geniş çalışma saatleri, günün size uygun saatinde gelmenizi kolaylaştırır. İlk gününüzde ekibimiz, hedefinize uygun bir başlangıç için yanınızdadır.',
        'Spor 35, İzmir’in Buca ilçesinde yer alan en temiz spor salonlarından biridir. Antrenman alanları düzenli tutulur, ekipmanlar bakımlıdır ve salonun temposu hedefinize yer açar. Kardiyo, kuvvet ve serbest ağırlık alanları ayrıdır; antrenmanınız kesilmeden ilerler. Geniş çalışma saatleri, günün size uygun saatinde gelmenizi kolaylaştırır. İlk gününüzde ekibimiz, hedefinize uygun bir başlangıç için yanınızdadır.',
    ];

    private const OLD_PARAGRAPHS_EN = [
        'Sports35 is one of the cleanest gyms in Buca, İzmir. Training areas stay tidy, the equipment is looked after, and the pace of the gym leaves room for your goal. Cardio, strength, and free-weight areas are separate, so a workout can continue without interruption. Long opening hours make it easier to come at a time that suits your day. On your first visit, the team helps you start in a way that matches your goal.',
        'Spor 35 is one of the cleanest gyms in Buca, İzmir. Training areas stay tidy, the equipment is looked after, and the pace of the gym leaves room for your goal. Cardio, strength, and free-weight areas are separate, so a workout can continue without interruption. Long opening hours make it easier to come at a time that suits your day. On your first visit, the team helps you start in a way that matches your goal.',
    ];

    private const PARAGRAPH_TR = 'Sports35, İzmir’in Buca ilçesinde yer alan bir spor salonudur. Antrenman alanları düzenli tutulur, ekipmanlar bakımlıdır ve salonun temposu hedefinize yer açar. Kardiyo, kuvvet ve serbest ağırlık alanları ayrıdır; antrenmanınız kesilmeden ilerler. Geniş çalışma saatleri, günün size uygun saatinde gelmenizi kolaylaştırır. İlk gününüzde ekibimiz, hedefinize uygun bir başlangıç için yanınızdadır.';

    private const PARAGRAPH_EN = 'Sports35 is a gym in Buca, İzmir. Training areas stay tidy, the equipment is looked after, and the pace of the gym leaves room for your goal. Cardio, strength, and free-weight areas are separate, so a workout can continue without interruption. Long opening hours make it easier to come at a time that suits your day. On your first visit, the team helps you start in a way that matches your goal.';

    public function up(): void
    {
        $this->replaceWhyUs();
        $this->clearPlaceholderContact();
        Cache::forget('site_settings.why_us');
        Cache::forget('site_settings.contact');
    }

    public function down(): void
    {
        $stored = json_decode((string) SiteSetting::get('home.why_us'), true);

        if (! is_array($stored)) {
            return;
        }

        if (($stored['paragraph_tr'] ?? '') === self::PARAGRAPH_TR) {
            $stored['paragraph_tr'] = self::OLD_PARAGRAPHS_TR[0];
        }

        if (($stored['paragraph_en'] ?? '') === self::PARAGRAPH_EN) {
            $stored['paragraph_en'] = self::OLD_PARAGRAPHS_EN[0];
        }

        SiteSetting::set('home.why_us', json_encode($stored, JSON_UNESCAPED_UNICODE));
        Cache::forget('site_settings.why_us');
    }

    private function replaceWhyUs(): void
    {
        $stored = json_decode((string) SiteSetting::get('home.why_us'), true);

        if (! is_array($stored)) {
            return;
        }

        if (in_array($stored['paragraph_tr'] ?? '', self::OLD_PARAGRAPHS_TR, true)) {
            $stored['paragraph_tr'] = self::PARAGRAPH_TR;
        }

        if (in_array($stored['paragraph_en'] ?? '', self::OLD_PARAGRAPHS_EN, true)) {
            $stored['paragraph_en'] = self::PARAGRAPH_EN;
        }

        SiteSetting::set('home.why_us', json_encode($stored, JSON_UNESCAPED_UNICODE));
    }

    private function clearPlaceholderContact(): void
    {
        $email = strtolower(trim((string) SiteSetting::get('contact.email', '')));
        $host = ltrim((string) strrchr($email, '@'), '@');

        foreach (['test', 'local', 'invalid', 'example', 'localhost'] as $suffix) {
            if ($host === $suffix || str_ends_with($host, '.'.$suffix)) {
                SiteSetting::set('contact.email', '');
                break;
            }
        }

        foreach (['social.facebook', 'social.instagram'] as $key) {
            if ($this->placeholderSocial((string) SiteSetting::get($key, ''))) {
                SiteSetting::set($key, '');
            }
        }

        $accounts = json_decode((string) SiteSetting::get('social.accounts', ''), true);

        if (! is_array($accounts)) {
            return;
        }

        $accounts = array_values(array_filter(
            $accounts,
            fn ($account) => ! is_array($account) || ! $this->placeholderSocial((string) ($account['url'] ?? '')),
        ));

        SiteSetting::set('social.accounts', json_encode($accounts, JSON_UNESCAPED_SLASHES));
    }

    private function placeholderSocial(string $url): bool
    {
        $url = trim($url);

        if ($url === '') {
            return false;
        }

        $parts = parse_url($url);
        $host = strtolower((string) preg_replace('/^www\./', '', (string) ($parts['host'] ?? '')));
        $path = strtolower(trim((string) ($parts['path'] ?? ''), '/'));

        return in_array($host, ['facebook.com', 'instagram.com', 'fb.com'], true)
            && $path === 'sports35';
    }
};
