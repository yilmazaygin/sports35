<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        $contact = SiteSetting::contact();

        return Inertia::render('Admin/Dashboard', [
            'contentWarnings' => array_values(array_filter([
                $contact['phone'] ? null : __('admin.dashboard.missing_phone'),
                $contact['address_tr'] ? null : __('admin.dashboard.missing_address'),
            ])),
        ]);
    }
}
