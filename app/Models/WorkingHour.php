<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkingHour extends Model
{
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

    public function formattedHours(): string
    {
        if ($this->is_closed) {
            return 'Kapalı';
        }

        return substr($this->opens_at, 0, 5).' - '.substr($this->closes_at, 0, 5);
    }
}
