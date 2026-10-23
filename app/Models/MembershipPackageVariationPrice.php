<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MembershipPackageVariationPrice extends Model
{
    protected $fillable = [
        'membership_package_id',
        'membership_price_variation_id',
        'price',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
        ];
    }

    public function package(): BelongsTo
    {
        return $this->belongsTo(MembershipPackage::class, 'membership_package_id');
    }

    public function variation(): BelongsTo
    {
        return $this->belongsTo(MembershipPriceVariation::class, 'membership_price_variation_id');
    }
}
