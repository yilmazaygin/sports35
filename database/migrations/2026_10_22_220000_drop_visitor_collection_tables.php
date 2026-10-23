<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('lead_consents');
        Schema::dropIfExists('leads');
        Schema::dropIfExists('conversion_events');
    }

    public function down(): void
    {
        // Visitor collection was removed and is not restored.
    }
};
