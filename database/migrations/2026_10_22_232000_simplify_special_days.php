<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        DB::delete('
            delete from special_days
            where id not in (
                select id from (
                    select max(id) as id from special_days group by date
                ) as keepers
            )
        ');

        if (Schema::hasColumn('special_days', 'type')) {
            Schema::table('special_days', function (Blueprint $table) {
                $table->dropColumn('type');
            });
        }

        $indexes = collect(Schema::getIndexes('special_days'));
        $hasUniqueDate = $indexes->contains(
            fn (array $index) => ($index['columns'] ?? []) === ['date'] && ($index['unique'] ?? false)
        );

        if ($hasUniqueDate) {
            return;
        }

        Schema::table('special_days', function (Blueprint $table) use ($indexes) {
            foreach ($indexes as $index) {
                if (($index['columns'] ?? []) === ['date'] && ! ($index['primary'] ?? false)) {
                    $table->dropIndex($index['name']);
                }
            }

            $table->unique('date');
        });
    }

    public function down(): void
    {
        if (! Schema::hasColumn('special_days', 'type')) {
            Schema::table('special_days', function (Blueprint $table) {
                $table->string('type', 30)->default('other')->after('date');
            });
        }

        $indexes = collect(Schema::getIndexes('special_days'));
        $unique = $indexes->first(
            fn (array $index) => ($index['columns'] ?? []) === ['date'] && ($index['unique'] ?? false)
        );

        if ($unique) {
            Schema::table('special_days', function (Blueprint $table) use ($unique) {
                $table->dropUnique($unique['name']);
                $table->index('date');
            });
        }
    }
};
