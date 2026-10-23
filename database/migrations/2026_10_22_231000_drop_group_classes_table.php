<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('group_classes');
    }

    public function down(): void
    {
        // Group classes were removed and are not restored.
    }
};
