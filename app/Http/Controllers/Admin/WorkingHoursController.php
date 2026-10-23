<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateWorkingHoursRequest;
use App\Models\SiteSetting;
use App\Models\WorkingHour;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class WorkingHoursController extends Controller
{
    public function edit(): Response
    {
        $hours = WorkingHour::query()
            ->orderBy('sort_order')
            ->get()
            ->map(fn (WorkingHour $hour) => [
                'id' => $hour->id,
                'day_key' => $hour->day_key,
                'opens_at' => $hour->opens_at ? substr((string) $hour->opens_at, 0, 5) : '',
                'closes_at' => $hour->closes_at ? substr((string) $hour->closes_at, 0, 5) : '',
                'is_closed' => $hour->is_closed,
            ]);

        return Inertia::render('Admin/WorkingHours/Edit', [
            'hours' => $hours,
            'layout' => WorkingHour::layout(),
        ]);
    }

    public function update(UpdateWorkingHoursRequest $request): RedirectResponse
    {
        $layout = $request->validated('layout');
        $groups = collect($request->validated('groups'))->keyBy('key');

        foreach (WorkingHour::LAYOUTS[$layout] as $key => $days) {
            $group = $groups->get($key);

            WorkingHour::query()->whereIn('day_key', $days)->update([
                'opens_at' => $group['is_closed'] ? null : $group['opens_at'],
                'closes_at' => $group['is_closed'] ? null : $group['closes_at'],
                'is_closed' => $group['is_closed'],
            ]);
        }

        SiteSetting::set('working_hours.layout', $layout);

        return back()->with('success', __('admin.messages.saved'));
    }
}
