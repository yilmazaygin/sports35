<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BlogPost extends Model
{
    protected $fillable = [
        'blog_category_id',
        'title_tr',
        'title_en',
        'slug',
        'excerpt_tr',
        'excerpt_en',
        'content_tr',
        'content_en',
        'meta_title_tr',
        'meta_title_en',
        'meta_description_tr',
        'meta_description_en',
        'featured_image',
        'published_at',
        'is_published',
    ];

    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
            'is_published' => 'boolean',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(BlogCategory::class, 'blog_category_id');
    }

    public function localizedTitle(): string
    {
        return app()->getLocale() === 'en' ? $this->title_en : $this->title_tr;
    }

    public function localizedContent(): string
    {
        return app()->getLocale() === 'en' ? $this->content_en : $this->content_tr;
    }
}
