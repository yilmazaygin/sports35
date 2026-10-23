<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('social_posts');
        Storage::disk('public')->deleteDirectory('social');
    }

    public function down(): void
    {
        // Social posts were removed and are not restored.
    }
};
