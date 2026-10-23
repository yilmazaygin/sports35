<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class DeleteAdminCommand extends Command
{
    protected $signature = 'admin:delete
        {email : Login email}
        {--force : Delete without confirmation}';

    protected $description = 'Delete an admin account';

    public function handle(): int
    {
        $email = strtolower(trim((string) $this->argument('email')));
        $user = User::query()->where('email', $email)->first();

        if (! $user) {
            $this->error("No admin account found for {$email}.");

            return self::FAILURE;
        }

        $isLastActiveAccount = $user->is_active
            && ! User::query()->where('is_active', true)->whereKeyNot($user->getKey())->exists();

        if ($isLastActiveAccount) {
            $this->error('Son aktif yönetici hesabı silinemez. Önce başka bir hesap açın.');

            return self::FAILURE;
        }

        if (! $this->option('force') && ! $this->confirm("Delete {$email}?")) {
            $this->info('Nothing was deleted.');

            return self::SUCCESS;
        }

        $user->delete();
        $this->info("Admin account deleted for {$email}.");

        return self::SUCCESS;
    }
}
