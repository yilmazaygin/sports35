<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AdminUserController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/AdminUsers/Index', [
            'users' => User::query()->orderBy('name')->get(['id', 'name', 'email', 'role', 'is_active', 'created_at']),
            'roles' => User::ROLES,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request, true);
        User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => $data['role'],
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        return back()->with('success', trans('admin.messages.created'));
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $data = $this->validated($request, false);
        $willRemoveOwner = $user->role === 'owner' && (($data['role'] ?? 'owner') !== 'owner' || array_key_exists('is_active', $data) && ! $data['is_active']);

        if ($willRemoveOwner && User::query()->where('role', 'owner')->where('is_active', true)->count() <= 1) {
            return back()->with('error', 'At least one active owner account must remain.');
        }

        if ($user->is(auth()->user()) && array_key_exists('is_active', $data) && ! $data['is_active']) {
            return back()->with('error', 'You cannot disable the account you are currently using.');
        }

        $user->fill(collect($data)->except('password')->all());
        if (! empty($data['password'])) {
            $user->password = Hash::make($data['password']);
        }
        $user->save();

        return back()->with('success', trans('admin.messages.saved'));
    }

    private function validated(Request $request, bool $creating): array
    {
        $rules = [
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($request->route('user'))],
            'role' => ['required', Rule::in(User::ROLES)],
        ];

        if ($creating) {
            $rules['password'] = ['required', 'string', 'min:8', 'confirmed'];
        } else {
            $rules['password'] = ['nullable', 'string', 'min:8', 'confirmed'];
            $rules['is_active'] = ['required', 'boolean'];
        }

        return $request->validate($rules);
    }
}
