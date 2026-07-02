<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BlogCategory extends Model
{
    protected $fillable = [
        'name_tr',
        'name_en',
        'slug',
        'sort_order',
    ];

    public function posts(): HasMany
    {
        return $this->hasMany(BlogPost::class);
    }

    public function localizedName(): string
    {
        return app()->getLocale() === 'en' ? $this->name_en : $this->name_tr;
    }
}
