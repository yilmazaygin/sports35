<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class SocialPost extends Model
{
    protected $fillable = [
        'platform',
        'image_path',
        'post_url',
        'caption_tr',
        'caption_en',
        'sort_order',
        'is_active',
    ];

    protected function casts(): array
    {
        return ['is_active' => 'boolean'];
    }

    public function imageUrl(): string
    {
        return Storage::disk('public')->url($this->image_path);
    }

    public function localizedCaption(): ?string
    {
        $caption = app()->getLocale() === 'en' ? $this->caption_en : $this->caption_tr;

        return $caption ?: null;
    }
}
