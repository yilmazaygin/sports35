<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateWorkingHoursRequest;
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
        ]);
    }

    public function update(UpdateWorkingHoursRequest $request): RedirectResponse
    {
        foreach ($request->validated('hours') as $hourData) {
            WorkingHour::where('id', $hourData['id'])->update([
                'opens_at' => $hourData['is_closed'] ? null : $hourData['opens_at'],
                'closes_at' => $hourData['is_closed'] ? null : $hourData['closes_at'],
                'is_closed' => $hourData['is_closed'],
            ]);
        }

        return back()->with('success', __('admin.messages.saved'));
    }
}
