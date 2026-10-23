<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Validator;

class ChangeAdminPasswordCommand extends Command
{
    protected $signature = 'admin:password
        {email : Login email}
        {--password= : New password. Omitted values are prompted and are not stored in shell history}';

    protected $description = 'Change an admin account password';

    public function handle(): int
    {
        $email = strtolower(trim((string) $this->argument('email')));
        $user = User::query()->where('email', $email)->first();

        if (! $user) {
            $this->error("No admin account found for {$email}.");

            return self::FAILURE;
        }

        $password = $this->password();

        if ($password === null) {
            return self::FAILURE;
        }

        $validator = Validator::make(
            ['password' => $password],
            ['password' => ['required', 'string', 'min:8']],
        );

        if ($validator->fails()) {
            foreach ($validator->errors()->all() as $error) {
                $this->error($error);
            }

            return self::FAILURE;
        }

        $user->password = $password;
        $user->save();

        $this->info("Password updated for {$email}.");

        return self::SUCCESS;
    }

    private function password(): ?string
    {
        $password = $this->option('password');

        if (is_string($password) && $password !== '') {
            return $password;
        }

        $password = (string) $this->secret('Password');
        $confirmation = (string) $this->secret('Confirm password');

        if ($password !== $confirmation) {
            $this->error('Passwords do not match.');

            return null;
        }

        return $password;
    }
}
