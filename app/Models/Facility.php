<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Facility extends Model
{
    protected $fillable = [
        'name_tr', 'name_en', 'category', 'description_tr', 'description_en', 'image_path',
        'sort_order', 'is_active',
    ];

    protected function casts(): array
    {
        return ['is_active' => 'boolean'];
    }

    public function imageUrl(): ?string
    {
        return $this->image_path ? Storage::disk('public')->url($this->image_path) : null;
    }

    public function localizedName(): string
    {
        return app()->getLocale() === 'en' ? ($this->name_en ?: $this->name_tr) : ($this->name_tr ?: $this->name_en);
    }

    public function localizedDescription(): ?string
    {
        return app()->getLocale() === 'en' ? ($this->description_en ?: $this->description_tr) : ($this->description_tr ?: $this->description_en);
    }
}
