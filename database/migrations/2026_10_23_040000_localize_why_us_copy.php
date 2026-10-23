<?php

use App\Models\SiteSetting;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Cache;

return new class extends Migration
{
    private const PREVIOUS_PARAGRAPH_TR = 'Sports35’te alanlar düzenli tutulur, ekipmanlar bakımlıdır ve salonun temposu hedefinize yer açar. Temiz bir ortamda, güncel makinelerle çalışmak burada günlük rutinin parçasıdır. Kardiyo, kuvvet ve serbest ağırlık alanları ayrı durur; antrenmanınız kesilmeden ilerler. Geniş çalışma saatleri, günün size uygun saatinde gelmenizi kolaylaştırır. İlk gününüzde ekibimiz, hedefinize uygun bir başlangıç için yanınızdadır.';

    private const PREVIOUS_SHORT_PARAGRAPH_TR = 'Sports35’te alanlar düzenli tutulur, ekipmanlar bakımlıdır ve salonun temposu hedefinize yer açar. Temiz bir ortamda, güncel makinelerle çalışmak burada günlük rutinin parçasıdır.';

    private const PREVIOUS_PARAGRAPH_EN = 'At Sports35 the floor stays orderly, the equipment is maintained, and the pace of the gym leaves room for your goal. Training on current machines in a clean space is part of the daily routine here. Cardio, strength, and free-weight areas sit apart, so a session can move without interruption. Long opening hours make it easier to train at a time that fits your day. On a first visit the team is there to help you start in a way that matches your goal.';

    private const PREVIOUS_SHORT_PARAGRAPH_EN = 'At Sports35 the floor stays orderly, the equipment is maintained, and the pace of the gym leaves room for your goal. Training on current machines in a clean space is part of the daily routine here.';

    private const PARAGRAPH_TR = 'Buca spor salonu Sports35’te alanlar düzenli tutulur, ekipmanlar bakımlıdır ve salonun temposu hedefinize yer açar. Şirinyer spor salonunda temiz bir ortamda, güncel makinelerle çalışmak burada günlük rutinin parçasıdır. Kardiyo, kuvvet ve serbest ağırlık alanları ayrı durur; antrenmanınız kesilmeden ilerler. İzmir spor salonunda geniş çalışma saatleri, günün size uygun saatinde gelmenizi kolaylaştırır. İlk gününüzde ekibimiz, hedefinize uygun bir başlangıç için yanınızdadır.';

    private const PARAGRAPH_EN = 'At the Buca gym Sports35, the floor stays orderly, the equipment is maintained, and the pace of the gym leaves room for your goal. At the Şirinyer gym, training on current machines in a clean space is part of the daily routine. Cardio, strength, and free-weight areas sit apart, so a session can move without interruption. At this Izmir gym, long opening hours make it easier to train at a time that fits your day. On a first visit the team is there to help you start in a way that matches your goal.';

    public function up(): void
    {
        $this->replace([
            'paragraph_tr' => [
                self::PREVIOUS_PARAGRAPH_TR => self::PARAGRAPH_TR,
                self::PREVIOUS_SHORT_PARAGRAPH_TR => self::PARAGRAPH_TR,
            ],
            'paragraph_en' => [
                self::PREVIOUS_PARAGRAPH_EN => self::PARAGRAPH_EN,
                self::PREVIOUS_SHORT_PARAGRAPH_EN => self::PARAGRAPH_EN,
            ],
        ], [
            0 => [
                'body_tr' => ['Antrenman alanları düzenli olarak temizlenir.' => 'Buca’daki antrenman alanları düzenli olarak temizlenir.'],
                'body_en' => ['Training areas are cleaned on a regular schedule.' => 'Training areas in Buca are cleaned on a regular schedule.'],
            ],
            1 => [
                'body_tr' => ['Bakımlı makineler ve serbest ağırlıklar kullanıma hazırdır.' => 'Şirinyer’de bakımlı makineler ve serbest ağırlıklar kullanıma hazırdır.'],
                'body_en' => ['Maintained machines and free weights are ready to use.' => 'Maintained machines and free weights in Şirinyer are ready to use.'],
            ],
            2 => [
                'body_tr' => ['Günün büyük bölümünde salona gelebilirsiniz.' => 'İzmir’de günün büyük bölümünde salona gelebilirsiniz.'],
                'body_en' => ['You can train through most of the day.' => 'In Izmir you can train through most of the day.'],
            ],
        ]);
    }

    public function down(): void
    {
        $this->replace([
            'paragraph_tr' => [self::PARAGRAPH_TR => self::PREVIOUS_PARAGRAPH_TR],
            'paragraph_en' => [self::PARAGRAPH_EN => self::PREVIOUS_PARAGRAPH_EN],
        ], [
            0 => [
                'body_tr' => ['Buca’daki antrenman alanları düzenli olarak temizlenir.' => 'Antrenman alanları düzenli olarak temizlenir.'],
                'body_en' => ['Training areas in Buca are cleaned on a regular schedule.' => 'Training areas are cleaned on a regular schedule.'],
            ],
            1 => [
                'body_tr' => ['Şirinyer’de bakımlı makineler ve serbest ağırlıklar kullanıma hazırdır.' => 'Bakımlı makineler ve serbest ağırlıklar kullanıma hazırdır.'],
                'body_en' => ['Maintained machines and free weights in Şirinyer are ready to use.' => 'Maintained machines and free weights are ready to use.'],
            ],
            2 => [
                'body_tr' => ['İzmir’de günün büyük bölümünde salona gelebilirsiniz.' => 'Günün büyük bölümünde salona gelebilirsiniz.'],
                'body_en' => ['In Izmir you can train through most of the day.' => 'You can train through most of the day.'],
            ],
        ]);
    }

    /**
     * @param  array<string, array<string, string>>  $fields
     * @param  array<int, array<string, array<string, string>>>  $bodies
     */
    private function replace(array $fields, array $bodies): void
    {
        $stored = SiteSetting::get('home.why_us');
        $data = is_string($stored) ? json_decode($stored, true) : null;

        if (! is_array($data)) {
            Cache::forget('site_settings.why_us');

            return;
        }

        $changed = false;

        foreach ($fields as $key => $map) {
            $current = $data[$key] ?? null;

            if (is_string($current) && isset($map[$current])) {
                $data[$key] = $map[$current];
                $changed = true;
            }
        }

        foreach ($bodies as $index => $fieldsForItem) {
            if (! is_array($data['items'][$index] ?? null)) {
                continue;
            }

            foreach ($fieldsForItem as $key => $map) {
                $current = $data['items'][$index][$key] ?? null;

                if (is_string($current) && isset($map[$current])) {
                    $data['items'][$index][$key] = $map[$current];
                    $changed = true;
                }
            }
        }

        if ($changed) {
            SiteSetting::set('home.why_us', json_encode($data, JSON_UNESCAPED_UNICODE));
        }

        Cache::forget('site_settings.why_us');
    }
};
