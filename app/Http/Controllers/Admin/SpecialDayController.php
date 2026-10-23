<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreSpecialDayRequest;
use App\Http\Requests\Admin\UpdateSpecialDayRequest;
use App\Models\SpecialDay;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SpecialDayController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/SpecialDays/Index', [
            'specialDays' => SpecialDay::query()
                ->orderByDesc('starts_on')
                ->orderByDesc('id')
                ->get()
                ->map(fn (SpecialDay $day) => [
                    'id' => $day->id,
                    'starts_on' => $day->starts_on?->toDateString(),
                    'ends_on' => $day->ends_on?->toDateString(),
                    'message_tr' => $day->message_tr,
                    'message_en' => $day->message_en,
                    'opens_at' => $day->opens_at,
                    'closes_at' => $day->closes_at,
                    'is_closed' => $day->is_closed,
                    'show_banner' => $day->show_banner,
                    'is_active' => $day->is_active,
                ]),
        ]);
    }

    public function store(StoreSpecialDayRequest $request): RedirectResponse
    {
        SpecialDay::create($request->validated());

        return back()->with('success', __('admin.messages.created'));
    }

    public function update(UpdateSpecialDayRequest $request, SpecialDay $specialDay): RedirectResponse
    {
        $specialDay->update($request->validated());

        return back()->with('success', __('admin.messages.saved'));
    }

    public function destroy(SpecialDay $specialDay): RedirectResponse
    {
        $specialDay->delete();

        return back()->with('success', __('admin.messages.deleted'));
    }
}
