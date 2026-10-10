<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\ConversionEvent;
use App\Services\ConversionEventService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ConversionEventController extends Controller
{
    public function store(Request $request, ConversionEventService $events): JsonResponse
    {
        $data = $request->validate([
            'event_type' => ['required', 'string', 'in:free_trial_cta_click,free_trial_form_start,whatsapp_click,phone_click,email_click'],
            'path' => ['nullable', 'string', 'max:500'],
            'cta_source' => ['nullable', 'string', 'max:100'],
        ]);

        $metadata = array_filter(['cta_source' => $data['cta_source'] ?? null]);
        $events->record($request, $data['event_type'], $metadata);

        return response()->json(['ok' => true], 201);
    }
}
