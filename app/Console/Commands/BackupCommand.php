<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Symfony\Component\Process\Process;

class BackupCommand extends Command
{
    protected $signature = 'app:backup {--output= : Backup directory (default: storage/app/backups)}';

    protected $description = 'Create database and storage backups';

    public function handle(): int
    {
        $outputDir = $this->option('output') ?: storage_path('app/backups');
        File::ensureDirectoryExists($outputDir);

        $timestamp = now()->format('Y-m-d_His');
        $dbFile = "{$outputDir}/db-{$timestamp}.sql";
        $storageFile = "{$outputDir}/storage-{$timestamp}.tar.gz";

        $this->info('Creating database backup...');

        $db = config('database.connections.'.config('database.default'));
        $process = match ($db['driver']) {
            'pgsql' => new Process([
                'pg_dump',
                '-h', $db['host'],
                '-p', (string) $db['port'],
                '-U', $db['username'],
                '-d', $db['database'],
                '-f', $dbFile,
            ], null, ['PGPASSWORD' => $db['password']]),
            'sqlite' => new Process([
                'sqlite3', database_path('database.sqlite'), '.dump',
            ]),
            default => null,
        };

        if ($process === null) {
            $this->error('Unsupported database driver: '.$db['driver']);

            return self::FAILURE;
        }

        $process->run();

        if (! $process->isSuccessful()) {
            $this->error('Database backup failed: '.$process->getErrorOutput());

            return self::FAILURE;
        }

        if ($db['driver'] === 'sqlite') {
            file_put_contents($dbFile, $process->getOutput());
        }

        $this->info("Database backup: {$dbFile}");

        $publicPath = storage_path('app/public');
        if (is_dir($publicPath)) {
            $this->info('Creating storage backup...');
            $tar = new Process(['tar', '-czf', $storageFile, '-C', $publicPath, '.']);
            $tar->run();

            if (! $tar->isSuccessful()) {
                $this->error('Storage backup failed: '.$tar->getErrorOutput());

                return self::FAILURE;
            }

            $this->info("Storage backup: {$storageFile}");
        }

        $this->info('Backup completed.');

        return self::SUCCESS;
    }
}
