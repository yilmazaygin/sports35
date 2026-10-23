<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('special_days', 'starts_on')) {
            Schema::table('special_days', function (Blueprint $table) {
                $table->date('starts_on')->nullable();
                $table->date('ends_on')->nullable();
            });
        }

        if (Schema::hasColumn('special_days', 'date')) {
            foreach (DB::table('special_days')->orderBy('id')->get() as $row) {
                $day = substr((string) $row->date, 0, 10);

                DB::table('special_days')->where('id', $row->id)->update([
                    'starts_on' => $day,
                    'ends_on' => $day,
                ]);
            }

            foreach (Schema::getIndexes('special_days') as $index) {
                if (($index['columns'] ?? []) === ['date'] && ($index['unique'] ?? false)) {
                    Schema::table('special_days', function (Blueprint $table) use ($index) {
                        $table->dropUnique($index['name']);
                    });
                }
            }

            Schema::table('special_days', function (Blueprint $table) {
                $table->dropColumn('date');
            });
        }
    }

    public function down(): void
    {
        if (! Schema::hasColumn('special_days', 'date')) {
            Schema::table('special_days', function (Blueprint $table) {
                $table->date('date')->nullable();
            });
        }

        foreach (DB::table('special_days')->orderBy('id')->get() as $row) {
            DB::table('special_days')->where('id', $row->id)->update([
                'date' => substr((string) ($row->starts_on ?? $row->date), 0, 10),
            ]);
        }

        Schema::table('special_days', function (Blueprint $table) {
            if (Schema::hasColumn('special_days', 'starts_on')) {
                $table->dropColumn(['starts_on', 'ends_on']);
            }
        });

        Schema::table('special_days', function (Blueprint $table) {
            $table->unique('date');
        });
    }
};
