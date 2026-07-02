<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class GalleryCategory extends Model
{
    protected $fillable = ['name_tr', 'name_en', 'slug', 'sort_order'];

    public function items(): HasMany
    {
        return $this->hasMany(GalleryItem::class);
    }

    public function localizedName(): string
    {
        return app()->getLocale() === 'en' ? $this->name_en : $this->name_tr;
    }
}
