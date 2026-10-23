<?php

use App\Models\SiteSetting;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Cache;

return new class extends Migration
{
    private const PREVIOUS_PARAGRAPH_TR = 'Sports35’te alanlar düzenli tutulur, ekipmanlar bakımlıdır ve salonun temposu hedefinize yer açar. Temiz bir ortamda, güncel makinelerle çalışmak burada günlük rutinin parçasıdır.';

    private const PREVIOUS_PARAGRAPH_EN = 'At Sports35 the floor stays orderly, the equipment is maintained, and the pace of the gym leaves room for your goal. Training on current machines in a clean space is part of the daily routine here.';

    private const PARAGRAPH_TR = 'Sports35’te alanlar düzenli tutulur, ekipmanlar bakımlıdır ve salonun temposu hedefinize yer açar. Temiz bir ortamda, güncel makinelerle çalışmak burada günlük rutinin parçasıdır. Kardiyo, kuvvet ve serbest ağırlık alanları ayrı durur; antrenmanınız kesilmeden ilerler. Geniş çalışma saatleri, günün size uygun saatinde gelmenizi kolaylaştırır. İlk gününüzde ekibimiz, hedefinize uygun bir başlangıç için yanınızdadır.';

    private const PARAGRAPH_EN = 'At Sports35 the floor stays orderly, the equipment is maintained, and the pace of the gym leaves room for your goal. Training on current machines in a clean space is part of the daily routine here. Cardio, strength, and free-weight areas sit apart, so a session can move without interruption. Long opening hours make it easier to train at a time that fits your day. On a first visit the team is there to help you start in a way that matches your goal.';

    public function up(): void
    {
        $this->replaceParagraphs(
            self::PREVIOUS_PARAGRAPH_TR,
            self::PREVIOUS_PARAGRAPH_EN,
            self::PARAGRAPH_TR,
            self::PARAGRAPH_EN,
        );
        Cache::forget('site_settings.why_us');
    }

    public function down(): void
    {
        $this->replaceParagraphs(
            self::PARAGRAPH_TR,
            self::PARAGRAPH_EN,
            self::PREVIOUS_PARAGRAPH_TR,
            self::PREVIOUS_PARAGRAPH_EN,
        );
        Cache::forget('site_settings.why_us');
    }

    private function replaceParagraphs(string $fromTr, string $fromEn, string $toTr, string $toEn): void
    {
        $stored = SiteSetting::get('home.why_us');
        $data = is_string($stored) ? json_decode($stored, true) : null;

        if (! is_array($data)) {
            return;
        }

        $changed = false;

        if (($data['paragraph_tr'] ?? '') === $fromTr) {
            $data['paragraph_tr'] = $toTr;
            $changed = true;
        }

        if (($data['paragraph_en'] ?? '') === $fromEn) {
            $data['paragraph_en'] = $toEn;
            $changed = true;
        }

        if ($changed) {
            SiteSetting::set('home.why_us', json_encode($data, JSON_UNESCAPED_UNICODE));
        }
    }
};
