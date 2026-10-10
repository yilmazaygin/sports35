<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Lead extends Model
{
    public const STATUSES = ['new', 'contacted', 'trial_scheduled', 'trial_completed', 'converted', 'lost'];

    protected $fillable = [
        'first_name', 'last_name', 'phone', 'email', 'source', 'landing_page', 'referrer', 'utm_source',
        'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'cta_source', 'interested_service', 'note',
        'status', 'marketing_opt_in', 'marketing_opt_in_at', 'marketing_opt_out_at', 'unsubscribe_token',
    ];

    protected function casts(): array
    {
        return [
            'marketing_opt_in' => 'boolean',
            'marketing_opt_in_at' => 'datetime',
            'marketing_opt_out_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Lead $lead) {
            $lead->unsubscribe_token ??= (string) Str::uuid();
        });
    }

    public function consents(): HasMany
    {
        return $this->hasMany(LeadConsent::class);
    }

    public function getNameAttribute(): string
    {
        return trim($this->first_name.' '.$this->last_name);
    }
}
