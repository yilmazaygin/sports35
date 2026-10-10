<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GroupClass;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GroupClassController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim()->toString();
        $classes = GroupClass::query()->when($search, fn ($query) => $query->where('name_tr', 'like', "%{$search}%")->orWhere('name_en', 'like', "%{$search}%"))->orderBy('sort_order')->paginate(20)->withQueryString();
        return Inertia::render('Admin/GroupClasses/Index', ['classes' => $classes->getCollection(), 'pagination' => $classes->toArray()['links'], 'search' => $search]);
    }

    public function store(Request $request): RedirectResponse
    {
        GroupClass::create($this->validated($request));
        return back()->with('success', __('admin.messages.created'));
    }

    public function update(Request $request, GroupClass $groupClass): RedirectResponse
    {
        $groupClass->update($this->validated($request));
        return back()->with('success', __('admin.messages.saved'));
    }

    public function destroy(GroupClass $groupClass): RedirectResponse
    {
        $groupClass->delete();
        return back()->with('success', __('admin.messages.deleted'));
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'name_tr' => ['required', 'string', 'max:255'], 'name_en' => ['required', 'string', 'max:255'],
            'description_tr' => ['nullable', 'string', 'max:1000'], 'description_en' => ['nullable', 'string', 'max:1000'],
            'difficulty_tr' => ['nullable', 'string', 'max:100'], 'difficulty_en' => ['nullable', 'string', 'max:100'],
            'schedule_text_tr' => ['nullable', 'string', 'max:255'], 'schedule_text_en' => ['nullable', 'string', 'max:255'],
            'instructor_name_tr' => ['nullable', 'string', 'max:255'], 'instructor_name_en' => ['nullable', 'string', 'max:255'],
            'sort_order' => ['integer', 'min:0'], 'is_active' => ['boolean'],
        ]);
    }
}
