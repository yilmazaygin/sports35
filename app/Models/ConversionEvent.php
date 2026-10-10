<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConversionEvent extends Model
{
    protected $fillable = [
        'event_type', 'path', 'landing_page', 'referrer', 'utm_source', 'utm_medium',
        'utm_campaign', 'utm_content', 'utm_term', 'cta_source', 'metadata',
    ];

    protected function casts(): array
    {
        return ['metadata' => 'array'];
    }

    public const TYPES = [
        'page_view', 'free_trial_cta_click', 'free_trial_form_start', 'free_trial_form_submitted',
        'whatsapp_click', 'phone_click', 'email_click',
    ];
}
