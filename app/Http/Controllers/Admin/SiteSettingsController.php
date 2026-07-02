<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateSiteSettingsRequest;
use App\Models\SiteSetting;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SiteSettingsController extends Controller
{
    public function edit(): Response
    {
        $contact = SiteSetting::contact();

        return Inertia::render('Admin/SiteSettings/Edit', [
            'settings' => [
                'contact.phone' => $contact['phone'],
                'contact.whatsapp' => $contact['whatsapp'],
                'contact.email' => $contact['email'],
                'contact.address_tr' => $contact['address_tr'],
                'contact.address_en' => $contact['address_en'],
                'social.facebook' => $contact['facebook'],
                'social.instagram' => $contact['instagram'],
                'contact.maps_embed' => $contact['maps_embed'],
            ],
        ]);
    }

    public function update(UpdateSiteSettingsRequest $request): RedirectResponse
    {
        foreach ($request->validated() as $key => $value) {
            SiteSetting::set($key, $value ?? '');
        }

        return back()->with('success', __('admin.messages.saved'));
    }
}
