<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Campaign extends Model
{
    public const TIMEZONE = 'Europe/Istanbul';

    protected $fillable = [
        'title_tr',
        'title_en',
        'body_tr',
        'body_en',
        'icon_path',
        'starts_on',
        'ends_on',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'starts_on' => 'date',
            'ends_on' => 'date',
            'is_active' => 'boolean',
        ];
    }

    public static function today(): Carbon
    {
        return Carbon::now(self::TIMEZONE)->startOfDay();
    }

    public function scopeCurrentlyActive($query)
    {
        $today = self::today()->toDateString();

        return $query
            ->where('is_active', true)
            ->whereDate('starts_on', '<=', $today)
            ->whereDate('ends_on', '>=', $today);
    }

    public static function deactivateExpired(): void
    {
        $today = self::today()->toDateString();

        static::query()
            ->where('is_active', true)
            ->whereDate('ends_on', '<', $today)
            ->update(['is_active' => false]);
    }

    public static function remainsActiveOn(string $endsOn): bool
    {
        return $endsOn >= self::today()->toDateString();
    }

    public function iconUrl(): ?string
    {
        return $this->icon_path ? Storage::disk('public')->url($this->icon_path) : null;
    }

    public function localizedTitle(): string
    {
        return app()->getLocale() === 'en'
            ? ($this->title_en ?: $this->title_tr)
            : ($this->title_tr ?: $this->title_en);
    }

    public function localizedBody(): string
    {
        return app()->getLocale() === 'en'
            ? ($this->body_en ?: $this->body_tr)
            : ($this->body_tr ?: $this->body_en);
    }
}
