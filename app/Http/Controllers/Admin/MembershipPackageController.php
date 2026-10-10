<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreMembershipPackageRequest;
use App\Http\Requests\Admin\UpdateMembershipPackageRequest;
use App\Models\MembershipPackage;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class MembershipPackageController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/MembershipPackages/Index', [
            'packages' => MembershipPackage::query()
                ->orderBy('sort_order')
                ->orderBy('duration_months')
                ->get(),
        ]);
    }

    public function store(StoreMembershipPackageRequest $request): RedirectResponse
    {
        $data = $request->validated();
        MembershipPackage::create($data);

        return back()->with('success', __('admin.messages.created'));
    }

    public function update(UpdateMembershipPackageRequest $request, MembershipPackage $membershipPackage): RedirectResponse
    {
        $data = $request->validated();
        $membershipPackage->update($data);

        return back()->with('success', __('admin.messages.saved'));
    }

    public function destroy(MembershipPackage $membershipPackage): RedirectResponse
    {
        $membershipPackage->delete();

        return back()->with('success', __('admin.messages.deleted'));
    }
}
