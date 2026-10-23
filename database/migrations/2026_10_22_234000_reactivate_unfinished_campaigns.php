<?php

use Carbon\Carbon;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('campaigns')
            ->whereDate('ends_on', '>=', Carbon::now('Europe/Istanbul')->toDateString())
            ->update(['is_active' => true]);
    }

    public function down(): void
    {
        // Active state follows the campaign end date and is not reverted.
    }
};
