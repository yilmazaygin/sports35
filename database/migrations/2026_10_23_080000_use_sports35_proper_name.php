<?php

use App\Models\SiteSetting;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Cache;

return new class extends Migration
{
    public function up(): void
    {
        $this->rename('Spor 35', 'Sports35');
    }

    public function down(): void
    {
        $this->rename('Sports35', 'Spor 35');
    }

    private function rename(string $from, string $to): void
    {
        $stored = SiteSetting::get('home.why_us');

        if (is_string($stored) && str_contains($stored, $from)) {
            SiteSetting::set('home.why_us', str_replace($from, $to, $stored));
        }

        Cache::forget('site_settings.why_us');
    }
};
