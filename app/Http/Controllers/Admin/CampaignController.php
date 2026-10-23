<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCampaignRequest;
use App\Http\Requests\Admin\UpdateCampaignRequest;
use App\Models\Campaign;
use App\Services\ImageOptimizer;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class CampaignController extends Controller
{
    public function __construct(private ImageOptimizer $imageOptimizer) {}

    public function index(): Response
    {
        Campaign::deactivateExpired();

        $today = Campaign::today()->toDateString();
        $current = Campaign::query()->whereDate('ends_on', '>=', $today)->orderBy('starts_on')->orderBy('id')->get();
        $past = Campaign::query()->whereDate('ends_on', '<', $today)->orderByDesc('ends_on')->orderByDesc('id')->get();

        return Inertia::render('Admin/Campaigns/Index', [
            'campaigns' => $current->map(fn (Campaign $campaign) => $this->present($campaign))->values(),
            'pastCampaigns' => $past->map(fn (Campaign $campaign) => $this->present($campaign))->values(),
        ]);
    }

    public function store(StoreCampaignRequest $request): RedirectResponse
    {
        $data = $this->attributes($request->validated());

        if ($request->hasFile('icon')) {
            $data['icon_path'] = $this->imageOptimizer->optimizeAndStore($request->file('icon'), 'campaigns/'.date('Y/m'));
        }

        Campaign::create($data);

        return back()->with('success', __('admin.messages.created'));
    }

    public function update(UpdateCampaignRequest $request, Campaign $campaign): RedirectResponse
    {
        $data = $this->attributes($request->validated());

        if ($request->hasFile('icon')) {
            $this->deleteIcon($campaign->icon_path);
            $data['icon_path'] = $this->imageOptimizer->optimizeAndStore($request->file('icon'), 'campaigns/'.date('Y/m'));
        } elseif ($request->boolean('remove_icon')) {
            $this->deleteIcon($campaign->icon_path);
            $data['icon_path'] = null;
        }

        $campaign->update($data);

        return back()->with('success', __('admin.messages.saved'));
    }

    public function destroy(Campaign $campaign): RedirectResponse
    {
        $this->deleteIcon($campaign->icon_path);
        $campaign->delete();

        return back()->with('success', __('admin.messages.deleted'));
    }

    private function attributes(array $data): array
    {
        unset($data['icon'], $data['remove_icon']);

        $data['starts_on'] = Carbon::parse($data['starts_on'])->toDateString();
        $data['ends_on'] = Carbon::parse($data['ends_on'])->toDateString();
        $data['is_active'] = Campaign::remainsActiveOn($data['ends_on']);

        return $data;
    }

    private function present(Campaign $campaign): array
    {
        return [
            'id' => $campaign->id,
            'title_tr' => $campaign->title_tr,
            'title_en' => $campaign->title_en,
            'body_tr' => $campaign->body_tr,
            'body_en' => $campaign->body_en,
            'icon_url' => $campaign->iconUrl(),
            'starts_on' => $campaign->starts_on->toDateString(),
            'ends_on' => $campaign->ends_on->toDateString(),
            'is_active' => $campaign->is_active,
            'scheduled' => $campaign->starts_on->toDateString() > Campaign::today()->toDateString(),
        ];
    }

    private function deleteIcon(?string $path): void
    {
        if ($path) {
            Storage::disk('public')->delete($path);
        }
    }
}
