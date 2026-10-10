<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class LeadController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->string('status')->toString();
        $search = $request->string('search')->trim()->toString();
        $source = $request->string('source')->trim()->toString();
        $sort = $request->string('sort', 'newest')->toString();
        $leads = Lead::query()
            ->when(in_array($status, Lead::STATUSES, true), fn ($query) => $query->where('status', $status))
            ->when($source !== '', fn ($query) => $query->where(function ($q) use ($source) { $q->where('source', 'like', "%{$source}%")->orWhere('utm_source', 'like', "%{$source}%"); }))
            ->when($search !== '', fn ($query) => $query->where(function ($q) use ($search) { $q->where('first_name', 'like', "%{$search}%")->orWhere('last_name', 'like', "%{$search}%")->orWhere('email', 'like', "%{$search}%")->orWhere('phone', 'like', "%{$search}%"); }))
            ->orderBy($sort === 'oldest' ? 'created_at' : 'created_at', $sort === 'oldest' ? 'asc' : 'desc')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Leads/Index', [
            'leads' => $leads,
            'status' => $status,
            'search' => $search, 'source' => $source, 'sort' => $sort,
            'statuses' => Lead::STATUSES,
        ]);
    }

    public function show(Lead $lead): Response
    {
        return Inertia::render('Admin/Leads/Show', [
            'lead' => $lead->load('consents'),
            'statuses' => Lead::STATUSES,
        ]);
    }

    public function update(Request $request, Lead $lead): RedirectResponse
    {
        $data = $request->validate([
            'status' => ['required', Rule::in(Lead::STATUSES)],
            'note' => ['nullable', 'string', 'max:1000'],
        ]);

        $lead->update($data);

        return back()->with('success', __('admin.messages.saved'));
    }
}
