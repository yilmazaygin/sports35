<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('gallery_items', function (Blueprint $table) {
            $table->dropForeign(['gallery_category_id']);
        });

        Schema::table('gallery_items', function (Blueprint $table) {
            $table->unsignedBigInteger('gallery_category_id')->nullable()->change();
        });

        Schema::table('gallery_items', function (Blueprint $table) {
            $table->foreign('gallery_category_id')
                ->references('id')
                ->on('gallery_categories')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('gallery_items', function (Blueprint $table) {
            $table->dropForeign(['gallery_category_id']);
        });

        Schema::table('gallery_items', function (Blueprint $table) {
            $table->unsignedBigInteger('gallery_category_id')->nullable(false)->change();
        });

        Schema::table('gallery_items', function (Blueprint $table) {
            $table->foreign('gallery_category_id')
                ->references('id')
                ->on('gallery_categories')
                ->cascadeOnDelete();
        });
    }
};
