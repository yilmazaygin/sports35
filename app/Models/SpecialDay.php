<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SpecialDay extends Model
{
    protected $fillable = [
        'date',
        'type',
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
            'date' => 'date',
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
}
