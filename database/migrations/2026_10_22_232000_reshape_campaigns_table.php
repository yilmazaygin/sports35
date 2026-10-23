<?php

use Carbon\Carbon;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('campaigns', 'label')) {
            return;
        }

        Schema::table('campaigns', function (Blueprint $table) {
            $table->string('title')->nullable();
            $table->text('body')->nullable();
            $table->date('starts_on')->nullable();
            $table->date('ends_on')->nullable();
        });

        $today = Carbon::now('Europe/Istanbul')->toDateString();

        foreach (DB::table('campaigns')->orderBy('id')->get() as $row) {
            if ($row->label === 'spring_campaign' && ! $row->is_active && $row->starts_at === null && $row->ends_at === null) {
                DB::table('campaigns')->where('id', $row->id)->delete();

                continue;
            }

            $start = $row->starts_at
                ? Carbon::parse($row->starts_at)->timezone('Europe/Istanbul')->toDateString()
                : Carbon::parse($row->created_at)->timezone('Europe/Istanbul')->toDateString();
            $end = $row->ends_at
                ? Carbon::parse($row->ends_at)->timezone('Europe/Istanbul')->toDateString()
                : $start;

            DB::table('campaigns')->where('id', $row->id)->update([
                'title' => $row->title_tr ?: 'Kampanya',
                'body' => '',
                'starts_on' => $start,
                'ends_on' => $end,
                'is_active' => $end >= $today,
            ]);
        }

        Schema::table('campaigns', function (Blueprint $table) {
            $table->dropColumn(['label', 'title_tr', 'title_en', 'discount_percent', 'starts_at', 'ends_at']);
        });
    }

    public function down(): void
    {
        // The previous campaign shape is not restored.
    }
};
