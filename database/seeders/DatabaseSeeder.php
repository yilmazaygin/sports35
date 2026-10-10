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
                    'role' => 'owner',
                    'is_active' => true,
                ],
            );
        } else {
            $ownerEmail = env('SPORTS35_OWNER_EMAIL');
            $ownerPassword = env('SPORTS35_OWNER_PASSWORD');

            if (! filled($ownerEmail) || ! filled($ownerPassword)) {
                throw new \RuntimeException(
                    'Production seeding requires SPORTS35_OWNER_EMAIL and SPORTS35_OWNER_PASSWORD.',
                );
            }

            User::updateOrCreate(
                ['email' => $ownerEmail],
                [
                    'name' => env('SPORTS35_OWNER_NAME', 'Sports35 Owner'),
                    'password' => Hash::make($ownerPassword),
                    'email_verified_at' => now(),
                    'role' => 'owner',
                    'is_active' => true,
                ],
            );
        }

        $this->call(ContentSeeder::class);
        $this->call(Phase2Seeder::class);
        $this->call(Sports35PhotoSeeder::class);
    }
}
