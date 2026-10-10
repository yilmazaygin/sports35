<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('trainers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('photo_path')->nullable();
            $table->string('role_tr')->nullable();
            $table->string('role_en')->nullable();
            $table->string('specialties_tr')->nullable();
            $table->string('specialties_en')->nullable();
            $table->text('bio_tr')->nullable();
            $table->text('bio_en')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('group_classes', function (Blueprint $table) {
            $table->id();
            $table->string('name_tr');
            $table->string('name_en');
            $table->text('description_tr')->nullable();
            $table->text('description_en')->nullable();
            $table->string('difficulty_tr')->nullable();
            $table->string('difficulty_en')->nullable();
            $table->string('schedule_text_tr')->nullable();
            $table->string('schedule_text_en')->nullable();
            $table->string('instructor_name_tr')->nullable();
            $table->string('instructor_name_en')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('facilities', function (Blueprint $table) {
            $table->id();
            $table->string('name_tr');
            $table->string('name_en');
            $table->string('category')->default('other');
            $table->text('description_tr')->nullable();
            $table->text('description_en')->nullable();
            $table->string('image_path')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('facilities');
        Schema::dropIfExists('group_classes');
        Schema::dropIfExists('trainers');
    }
};
