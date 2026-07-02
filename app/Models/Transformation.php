<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Transformation extends Model
{
    protected $fillable = [
        'name',
        'before_image',
        'after_image',
        'description_tr',
        'description_en',
        'duration_label_tr',
        'duration_label_en',
        'sort_order',
        'is_active',
    ];

    protected function casts(): array
    {
        return ['is_active' => 'boolean'];
    }

    public function beforeImageUrl(): string
    {
        return Storage::disk('public')->url($this->before_image);
    }

    public function afterImageUrl(): string
    {
        return Storage::disk('public')->url($this->after_image);
    }

    public function localizedDescription(): ?string
    {
        return app()->getLocale() === 'en' ? $this->description_en : $this->description_tr;
    }

    public function localizedDuration(): ?string
    {
        return app()->getLocale() === 'en' ? $this->duration_label_en : $this->duration_label_tr;
    }
}
