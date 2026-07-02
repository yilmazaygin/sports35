<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('blog_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name_tr');
            $table->string('name_en');
            $table->string('slug')->unique();
            $table->unsignedTinyInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('blog_posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('blog_category_id')->nullable()->constrained()->nullOnDelete();
            $table->string('title_tr');
            $table->string('title_en');
            $table->string('slug')->unique();
            $table->text('excerpt_tr')->nullable();
            $table->text('excerpt_en')->nullable();
            $table->longText('content_tr');
            $table->longText('content_en');
            $table->string('meta_title_tr')->nullable();
            $table->string('meta_title_en')->nullable();
            $table->string('meta_description_tr')->nullable();
            $table->string('meta_description_en')->nullable();
            $table->string('featured_image')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->boolean('is_published')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('blog_posts');
        Schema::dropIfExists('blog_categories');
    }
};
