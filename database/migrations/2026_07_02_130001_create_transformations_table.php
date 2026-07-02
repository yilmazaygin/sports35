<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transformations', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('before_image');
            $table->string('after_image');
            $table->string('description_tr')->nullable();
            $table->string('description_en')->nullable();
            $table->string('duration_label_tr')->nullable();
            $table->string('duration_label_en')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transformations');
    }
};
