<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class SpecialDay extends Model
{
    public const TIMEZONE = 'Europe/Istanbul';

    protected $fillable = [
        'starts_on',
        'ends_on',
        'message_tr',
        'message_en',
        'opens_at',
        'closes_at',
        'is_closed',
        'show_banner',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'starts_on' => 'date',
            'ends_on' => 'date',
            'is_closed' => 'boolean',
            'show_banner' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    public function localizedMessage(): string
    {
        $locale = app()->getLocale();

        return $locale === 'en' ? $this->message_en : $this->message_tr;
    }

    public static function today(): string
    {
        return Carbon::now(self::TIMEZONE)->toDateString();
    }

    public function scopeCovering(Builder $query, mixed $date): Builder
    {
        $day = Carbon::parse($date)->toDateString();

        return $query
            ->whereDate('starts_on', '<=', $day)
            ->whereDate('ends_on', '>=', $day);
    }

    public static function rangeOverlaps(mixed $startsOn, mixed $endsOn, int|string|null $ignoreId = null): bool
    {
        return static::query()
            ->when($ignoreId, fn (Builder $query) => $query->whereKeyNot($ignoreId))
            ->whereDate('starts_on', '<=', Carbon::parse($endsOn)->toDateString())
            ->whereDate('ends_on', '>=', Carbon::parse($startsOn)->toDateString())
            ->exists();
    }
}
