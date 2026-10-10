<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Campaign;
use Inertia\Inertia;
use Inertia\Response;

class CampaignController extends Controller
{
    public function __invoke(): Response
    {
        $campaigns = Campaign::query()
            ->currentlyActive()
            ->orderByDesc('starts_at')
            ->get()
            ->map(fn (Campaign $campaign) => [
                'id' => $campaign->id,
                'title' => $campaign->localizedTitle(),
                'discount_percent' => $campaign->discount_percent,
                'starts_at' => $campaign->starts_at?->toIso8601String(),
                'ends_at' => $campaign->ends_at?->toIso8601String(),
            ])
            ->values()
            ->all();

        return Inertia::render('Public/Campaigns/Index', [
            'campaigns' => $campaigns,
        ]);
    }
}
