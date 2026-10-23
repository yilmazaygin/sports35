<?php

use App\Models\SiteSetting;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    private const OLD_ADDRESS = 'Inkilap, 504/2. Sk. 3B D:1, 35380 Buca/Izmir, Turkey';

    private const NEW_ADDRESS = 'İnkilap, 504/2. Sk. 3B D:1, 35380 Buca/İzmir, Turkey';

    private const OLD_HOURS = 'You can come in through most of the day.';

    private const NEW_HOURS = 'You can come to the gym for most of the day.';

    private const OLD_NOTICE = 'This week (19–25 October) the gym is open half day, 09:00–15:00 every day.';

    private const NEW_NOTICE = 'This week (19–25 October) the gym is open for half the day: 09:00–15:00 every day.';

    public function up(): void
    {
        if (SiteSetting::get('contact.address_en') === self::OLD_ADDRESS) {
            SiteSetting::set('contact.address_en', self::NEW_ADDRESS);
        }

        $this->replaceWhyUsHours(self::OLD_HOURS, self::NEW_HOURS);

        DB::table('membership_price_variations')
            ->where('name_tr', 'Öğrenci üyeliği')
            ->where('name_en', 'Student Discount')
            ->update(['name_en' => 'Student membership']);

        DB::table('special_days')
            ->where('message_en', self::OLD_NOTICE)
            ->update(['message_en' => self::NEW_NOTICE]);

        Cache::forget('site_settings.why_us');
    }

    public function down(): void
    {
        if (SiteSetting::get('contact.address_en') === self::NEW_ADDRESS) {
            SiteSetting::set('contact.address_en', self::OLD_ADDRESS);
        }

        $this->replaceWhyUsHours(self::NEW_HOURS, self::OLD_HOURS);

        DB::table('membership_price_variations')
            ->where('name_tr', 'Öğrenci üyeliği')
            ->where('name_en', 'Student membership')
            ->update(['name_en' => 'Student Discount']);

        DB::table('special_days')
            ->where('message_en', self::NEW_NOTICE)
            ->update(['message_en' => self::OLD_NOTICE]);

        Cache::forget('site_settings.why_us');
    }

    private function replaceWhyUsHours(string $from, string $to): void
    {
        $stored = SiteSetting::get('home.why_us');
        $data = is_string($stored) ? json_decode($stored, true) : null;

        if (! is_array($data) || ! is_array($data['items'][2] ?? null)) {
            return;
        }

        if (($data['items'][2]['body_en'] ?? null) !== $from) {
            return;
        }

        $data['items'][2]['body_en'] = $to;
        SiteSetting::set('home.why_us', json_encode($data, JSON_UNESCAPED_UNICODE));
    }
};
