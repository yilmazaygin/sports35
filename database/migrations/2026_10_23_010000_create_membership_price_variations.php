<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('membership_price_variations', function (Blueprint $table) {
            $table->id();
            $table->string('name_tr');
            $table->string('name_en');
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('membership_package_variation_prices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('membership_package_id')->constrained()->cascadeOnDelete();
            $table->foreignId('membership_price_variation_id')->constrained()->cascadeOnDelete();
            $table->decimal('price', 10, 2);
            $table->timestamps();

            $table->unique(
                ['membership_package_id', 'membership_price_variation_id'],
                'package_variation_price_unique',
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('membership_package_variation_prices');
        Schema::dropIfExists('membership_price_variations');
    }
};
