<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Trainer extends Model
{
    protected $fillable = [
        'name', 'photo_path', 'role_tr', 'role_en', 'specialties_tr', 'specialties_en',
        'bio_tr', 'bio_en', 'sort_order', 'is_active',
    ];

    protected function casts(): array
    {
        return ['is_active' => 'boolean'];
    }

    public function photoUrl(): ?string
    {
        return $this->photo_path ? Storage::disk('public')->url($this->photo_path) : null;
    }

    public function localizedRole(): ?string
    {
        return app()->getLocale() === 'en' ? ($this->role_en ?: $this->role_tr) : ($this->role_tr ?: $this->role_en);
    }

    public function localizedSpecialties(): ?string
    {
        return app()->getLocale() === 'en' ? ($this->specialties_en ?: $this->specialties_tr) : ($this->specialties_tr ?: $this->specialties_en);
    }

    public function localizedBio(): ?string
    {
        return app()->getLocale() === 'en' ? ($this->bio_en ?: $this->bio_tr) : ($this->bio_tr ?: $this->bio_en);
    }
}
