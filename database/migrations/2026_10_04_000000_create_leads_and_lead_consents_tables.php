<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('leads', function (Blueprint $table) {
            $table->id();
            $table->string('first_name', 100);
            $table->string('last_name', 100);
            $table->string('phone', 50);
            $table->string('email');
            $table->string('source', 100)->default('free_trial_form');
            $table->string('interested_service', 150)->nullable();
            $table->text('note')->nullable();
            $table->string('status', 30)->default('new')->index();
            $table->boolean('marketing_opt_in')->default(false);
            $table->timestamp('marketing_opt_in_at')->nullable();
            $table->timestamp('marketing_opt_out_at')->nullable();
            $table->uuid('unsubscribe_token')->unique();
            $table->timestamps();

            $table->index(['email', 'phone']);
        });

        Schema::create('lead_consents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lead_id')->constrained()->cascadeOnDelete();
            $table->string('consent_type', 50);
            $table->boolean('granted');
            $table->string('version', 50)->nullable();
            $table->string('source', 100)->default('free_trial_form');
            $table->ipAddress('ip_address')->nullable();
            $table->text('user_agent')->nullable();
            $table->string('provider', 50)->nullable();
            $table->string('provider_reference')->nullable();
            $table->timestamp('given_at');
            $table->timestamps();

            $table->index(['lead_id', 'consent_type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lead_consents');
        Schema::dropIfExists('leads');
    }
};
