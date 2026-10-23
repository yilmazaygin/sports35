<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('trainers');
        Storage::disk('public')->deleteDirectory('trainers');
    }

    public function down(): void
    {
        // Trainers were removed and are not restored.
    }
};
