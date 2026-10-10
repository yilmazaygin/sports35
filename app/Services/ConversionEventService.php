<?php

namespace App\Services;

use App\Models\ConversionEvent;
use Illuminate\Http\Request;

class ConversionEventService
{
    public function record(Request $request, string $type, array $metadata = []): ConversionEvent
    {
        $attribution = $request->session()->get('first_touch_attribution', []);
        $ctaSource = $metadata['cta_source'] ?? ($attribution['cta_source'] ?? null);
        $metadata = array_diff_key($metadata, ['cta_source' => true]);

        return ConversionEvent::create([
            'event_type' => $type,
            'path' => mb_substr($request->input('path', $request->path()), 0, 500),
            ...array_intersect_key($attribution, array_flip([
                'landing_page', 'referrer', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'cta_source',
            ])),
            'cta_source' => $ctaSource,
            'metadata' => $metadata ?: null,
        ]);
    }
}
