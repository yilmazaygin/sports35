<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('testimonials');
        Storage::disk('public')->deleteDirectory('testimonials');
    }

    public function down(): void
    {
        // Testimonials were removed and are not restored.
    }
};
