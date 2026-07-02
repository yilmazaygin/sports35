<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('special_days', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->string('type', 30)->default('other');
            $table->string('message_tr');
            $table->string('message_en');
            $table->time('opens_at')->nullable();
            $table->time('closes_at')->nullable();
            $table->boolean('is_closed')->default(false);
            $table->boolean('show_banner')->default(true);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index('date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('special_days');
    }
};
