<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasColumn('campaigns', 'title_tr')) {
            return;
        }

        Schema::table('campaigns', function (Blueprint $table) {
            $table->string('title_tr')->nullable();
            $table->string('title_en')->nullable();
            $table->text('body_tr')->nullable();
            $table->text('body_en')->nullable();
            $table->string('icon_path')->nullable();
        });

        if (Schema::hasColumn('campaigns', 'title')) {
            foreach (DB::table('campaigns')->orderBy('id')->get() as $row) {
                DB::table('campaigns')->where('id', $row->id)->update([
                    'title_tr' => $row->title ?: 'Kampanya',
                    'title_en' => $row->title ?: 'Campaign',
                    'body_tr' => $row->body ?: '',
                    'body_en' => $row->body ?: '',
                ]);
            }

            Schema::table('campaigns', function (Blueprint $table) {
                $table->dropColumn(['title', 'body']);
            });
        }
    }

    public function down(): void
    {
        // Translated campaign fields are not reverted.
    }
};
