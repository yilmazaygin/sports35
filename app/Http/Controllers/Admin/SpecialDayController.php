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
            'specialDays' => SpecialDay::query()->orderByDesc('date')->get(),
            'types' => ['holiday', 'renovation', 'half_day', 'closure', 'other'],
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
