<?php

namespace Database\Seeders;

use App\Models\MembershipPackage;
use App\Models\WorkingHour;
use Illuminate\Database\Seeder;

class ContentSeeder extends Seeder
{
    public function run(): void
    {
        $days = [
            ['day_key' => 'monday', 'opens_at' => '06:00', 'closes_at' => '23:00', 'sort_order' => 1],
            ['day_key' => 'tuesday', 'opens_at' => '06:00', 'closes_at' => '23:00', 'sort_order' => 2],
            ['day_key' => 'wednesday', 'opens_at' => '06:00', 'closes_at' => '23:00', 'sort_order' => 3],
            ['day_key' => 'thursday', 'opens_at' => '06:00', 'closes_at' => '23:00', 'sort_order' => 4],
            ['day_key' => 'friday', 'opens_at' => '06:00', 'closes_at' => '23:00', 'sort_order' => 5],
            ['day_key' => 'saturday', 'opens_at' => '08:00', 'closes_at' => '22:00', 'sort_order' => 6],
            ['day_key' => 'sunday', 'opens_at' => '08:00', 'closes_at' => '20:00', 'sort_order' => 7],
        ];

        foreach ($days as $day) {
            WorkingHour::query()->firstOrCreate(
                ['day_key' => $day['day_key']],
                $day,
            );
        }

        $packages = [
            ['duration_months' => 1, 'price' => 1500, 'sort_order' => 1],
            ['duration_months' => 3, 'price' => 4000, 'sort_order' => 2],
            ['duration_months' => 6, 'price' => 7500, 'sort_order' => 3],
            ['duration_months' => 12, 'price' => 12000, 'sort_order' => 4],
        ];

        foreach ($packages as $package) {
            MembershipPackage::query()->firstOrCreate(
                ['duration_months' => $package['duration_months']],
                $package,
            );
        }

    }
}
