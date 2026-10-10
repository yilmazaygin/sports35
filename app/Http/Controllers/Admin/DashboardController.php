<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use App\Models\Campaign;
use App\Models\SiteSetting;
use App\Models\Testimonial;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        $contact = SiteSetting::contact();

        return Inertia::render('Admin/Dashboard', [
            'newLeadCount' => Lead::where('status', 'new')->count(),
            'awaitingContactCount' => Lead::whereIn('status', ['new', 'contacted'])->count(),
            'recentLeads' => Lead::latest()->limit(5)->get(['id', 'first_name', 'last_name', 'status', 'created_at']),
            'activeCampaignCount' => Campaign::currentlyActive()->count(),
            'contentWarnings' => array_values(array_filter([
                $contact['phone'] ? null : __('admin.dashboard.missing_phone'),
                $contact['address_tr'] ? null : __('admin.dashboard.missing_address'),
                Testimonial::where('is_active', true)->exists() ? null : __('admin.dashboard.no_testimonials'),
            ])),
        ]);
    }
}
