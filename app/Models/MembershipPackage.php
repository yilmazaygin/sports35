<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MembershipPackage extends Model
{
    protected $fillable = [
        'duration_months',
        'cash_price',
        'card_price',
        'is_active',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'cash_price' => 'decimal:2',
            'card_price' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }
}
