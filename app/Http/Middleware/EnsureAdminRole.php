<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureAdminRole
{
    public function handle(Request $request, Closure $next, string ...$roles)
    {
        $user = $request->user();

        if (! $user || ! $user->is_active) {
            abort(403);
        }

        if ($user->isOwner()) {
            return $next($request);
        }

        if ($roles) {
            abort_unless(in_array($user->role, $roles, true), 403);
            return $next($request);
        }

        $managerRoutes = ['leads.*', 'analytics.index', 'membership-packages.*', 'campaigns.*', 'special-days.*', 'working-hours.*'];
        $ownerRoutes = ['site-settings.*', 'profile.*', 'password.update', 'admin-users.*', 'audit-logs.*'];

        if (collect($ownerRoutes)->contains(fn ($pattern) => $request->routeIs($pattern))) {
            abort(403);
        }

        if ($user->role === 'content_editor' && collect($managerRoutes)->contains(fn ($pattern) => $request->routeIs($pattern))) {
            abort(403);
        }

        return $next($request);
    }
}
