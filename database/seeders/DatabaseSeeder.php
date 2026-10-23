<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        if (app()->environment(['local', 'testing'])) {
            User::updateOrCreate(
                ['email' => 'admin@sports35.test'],
                [
                    'name' => 'Admin',
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                    'is_active' => true,
                ],
            );
        } else {
            $adminEmail = env('SPORTS35_ADMIN_EMAIL');
            $adminPassword = env('SPORTS35_ADMIN_PASSWORD');

            if (! filled($adminEmail) || ! filled($adminPassword)) {
                throw new \RuntimeException(
                    'Production seeding requires SPORTS35_ADMIN_EMAIL and SPORTS35_ADMIN_PASSWORD.',
                );
            }

            User::query()->firstOrCreate(
                ['email' => $adminEmail],
                [
                    'name' => env('SPORTS35_ADMIN_NAME', 'Sports35 Admin'),
                    'password' => Hash::make($adminPassword),
                    'email_verified_at' => now(),
                    'is_active' => true,
                ],
            );
        }

        $this->call(ContentSeeder::class);
        $this->call(Phase2Seeder::class);
        $this->call(Sports35PhotoSeeder::class);
    }
}
