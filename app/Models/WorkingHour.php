<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkingHour extends Model
{
    public const LAYOUTS = [
        'daily' => [
            'monday' => ['monday'],
            'tuesday' => ['tuesday'],
            'wednesday' => ['wednesday'],
            'thursday' => ['thursday'],
            'friday' => ['friday'],
            'saturday' => ['saturday'],
            'sunday' => ['sunday'],
        ],
        'split' => [
            'weekday' => ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
            'saturday' => ['saturday'],
            'sunday' => ['sunday'],
        ],
        'weekend' => [
            'weekday' => ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
            'weekend' => ['saturday', 'sunday'],
        ],
    ];

    protected $fillable = [
        'day_key',
        'opens_at',
        'closes_at',
        'is_closed',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'is_closed' => 'boolean',
        ];
    }

    public static function layout(): string
    {
        $value = SiteSetting::get('working_hours.layout', 'daily');

        return array_key_exists($value, self::LAYOUTS) ? $value : 'daily';
    }

    public function formattedHours(): string
    {
        if ($this->is_closed) {
            return 'Kapalı';
        }

        return substr($this->opens_at, 0, 5).' - '.substr($this->closes_at, 0, 5);
    }
}
