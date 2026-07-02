<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCampaignRequest;
use App\Http\Requests\Admin\UpdateCampaignRequest;
use App\Models\Campaign;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CampaignController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Campaigns/Index', [
            'campaigns' => Campaign::query()->latest()->get(),
        ]);
    }

    public function store(StoreCampaignRequest $request): RedirectResponse
    {
        Campaign::create($request->validated());

        return back()->with('success', __('admin.messages.created'));
    }

    public function update(UpdateCampaignRequest $request, Campaign $campaign): RedirectResponse
    {
        $campaign->update($request->validated());

        return back()->with('success', __('admin.messages.saved'));
    }

    public function destroy(Campaign $campaign): RedirectResponse
    {
        $campaign->delete();

        return back()->with('success', __('admin.messages.deleted'));
    }
}
