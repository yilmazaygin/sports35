<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LeadConsent extends Model
{
    protected $fillable = [
        'lead_id', 'consent_type', 'granted', 'version', 'source', 'ip_address', 'user_agent',
        'provider', 'provider_reference', 'given_at',
    ];

    protected function casts(): array
    {
        return ['granted' => 'boolean', 'given_at' => 'datetime'];
    }

    public function lead(): BelongsTo
    {
        return $this->belongsTo(Lead::class);
    }
}
