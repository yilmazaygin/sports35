<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasColumn('membership_packages', 'cash_price') && ! Schema::hasColumn('membership_packages', 'price')) {
            Schema::table('membership_packages', function (Blueprint $table) {
                $table->renameColumn('cash_price', 'price');
            });
        }

        if (Schema::hasColumn('membership_packages', 'card_price')) {
            Schema::table('membership_packages', function (Blueprint $table) {
                $table->dropColumn('card_price');
            });
        }

        if (! Schema::hasTable('audit_logs')) {
            return;
        }

        DB::table('audit_logs')->orderBy('id')->chunkById(100, function ($logs): void {
            foreach ($logs as $log) {
                $changes = is_array($log->changes) ? $log->changes : json_decode((string) $log->changes, true);

                if (! is_array($changes)) {
                    continue;
                }

                $dirty = false;

                if (array_key_exists('cash_price', $changes)) {
                    if (! array_key_exists('price', $changes)) {
                        $changes['price'] = $changes['cash_price'];
                    }
                    unset($changes['cash_price']);
                    $dirty = true;
                }

                if (array_key_exists('card_price', $changes)) {
                    unset($changes['card_price']);
                    $dirty = true;
                }

                if ($dirty) {
                    DB::table('audit_logs')->where('id', $log->id)->update([
                        'changes' => json_encode($changes),
                    ]);
                }
            }
        });
    }

    public function down(): void
    {
        if (Schema::hasColumn('membership_packages', 'price') && ! Schema::hasColumn('membership_packages', 'cash_price')) {
            Schema::table('membership_packages', function (Blueprint $table) {
                $table->renameColumn('price', 'cash_price');
            });
        }

        if (! Schema::hasColumn('membership_packages', 'card_price') && Schema::hasColumn('membership_packages', 'cash_price')) {
            Schema::table('membership_packages', function (Blueprint $table) {
                $table->decimal('card_price', 10, 2)->default(0);
            });

            DB::table('membership_packages')->update([
                'card_price' => DB::raw('cash_price'),
            ]);
        }
    }
};
