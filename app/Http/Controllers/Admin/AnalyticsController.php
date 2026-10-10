<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ConversionEvent;
use App\Models\Lead;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AnalyticsController extends Controller
{
    public function index(Request $request): Response
    {
        $from = Carbon::parse($request->input('from', now()->subDays(29)->toDateString()))->startOfDay();
        $to = Carbon::parse($request->input('to', now()->toDateString()))->endOfDay();
        $events = ConversionEvent::query()->whereBetween('created_at', [$from, $to]);
        $leads = Lead::query()->whereBetween('created_at', [$from, $to]);
        $eventCounts = (clone $events)->selectRaw('event_type, COUNT(*) as total')->groupBy('event_type')->pluck('total', 'event_type');
        $leadsByStatus = (clone $leads)->selectRaw('status, COUNT(*) as total')->groupBy('status')->pluck('total', 'status');
        $leadsBySource = (clone $leads)
            ->selectRaw("COALESCE(NULLIF(utm_source, ''), 'direct') as source, COUNT(*) as total")
            ->groupByRaw("COALESCE(NULLIF(utm_source, ''), 'direct')")
            ->pluck('total', 'source');
        $ctaClicks = (int) ($eventCounts['free_trial_cta_click'] ?? 0);
        $submissions = (int) ($eventCounts['free_trial_form_submitted'] ?? 0);

        return Inertia::render('Admin/Analytics/Index', [
            'from' => $from->toDateString(), 'to' => $to->toDateString(),
            'eventCounts' => $eventCounts, 'leadsByStatus' => $leadsByStatus,
            'leadsBySource' => $leadsBySource, 'leadCount' => (clone $leads)->count(),
            'conversionRate' => $ctaClicks > 0 ? round(($submissions / $ctaClicks) * 100, 1) : null,
        ]);
    }
}
