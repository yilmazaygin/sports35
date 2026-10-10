<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Testimonial extends Model
{
    protected $fillable = [
        'name', 'quote_tr', 'quote_en', 'context_tr', 'context_en', 'photo_path', 'is_active', 'sort_order',
    ];

    protected function casts(): array
    {
        return ['is_active' => 'boolean'];
    }

    public function photoUrl(): ?string
    {
        return $this->photo_path ? Storage::disk('public')->url($this->photo_path) : null;
    }

    public function localized(string $field): ?string
    {
        $localeField = $field.'_'.app()->getLocale();
        $fallbackField = $field.(app()->getLocale() === 'en' ? '_tr' : '_en');

        return $this->{$localeField} ?: $this->{$fallbackField};
    }
}
