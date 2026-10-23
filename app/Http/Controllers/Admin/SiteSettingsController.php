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
                'phone' => $contact['phone'],
                'whatsapp' => $contact['whatsapp'],
                'email' => $contact['email'],
                'address_tr' => $contact['address_tr'],
                'address_en' => $contact['address_en'],
                'maps_embed' => $contact['maps_embed'],
                'maps_url' => $contact['maps_url'],
                'social_accounts' => SiteSetting::socialAccountForm(),
                'video_audio' => SiteSetting::videoAudioEnabled(),
                'why_us' => SiteSetting::whyUs(),
            ],
        ]);
    }

    public function update(UpdateSiteSettingsRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $submitted = collect($data['social_accounts'] ?? [])->keyBy('platform');
        $accounts = collect(SiteSetting::SOCIAL_PLATFORMS)
            ->map(function (string $name, string $platform) use ($submitted) {
                if (! $submitted->has($platform)) {
                    return null;
                }

                return [
                    'platform' => $platform,
                    'name' => $name,
                    'url' => $submitted[$platform]['url'],
                ];
            })
            ->filter()
            ->values()
            ->all();

        SiteSetting::set('contact.phone', $data['phone'] ?? '');
        SiteSetting::set('contact.whatsapp', $data['whatsapp'] ?? '');
        SiteSetting::set('contact.email', $data['email'] ?? '');
        SiteSetting::set('contact.address_tr', $data['address_tr'] ?? '');
        SiteSetting::set('contact.address_en', $data['address_en'] ?? '');
        SiteSetting::set('contact.maps_embed', $data['maps_embed'] ?? '');
        SiteSetting::set('contact.maps_url', $data['maps_url'] ?? '');
        SiteSetting::set('social.accounts', json_encode($accounts, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
        SiteSetting::set('social.facebook', (string) data_get($submitted->get('facebook'), 'url', ''));
        SiteSetting::set('social.instagram', (string) data_get($submitted->get('instagram'), 'url', ''));
        SiteSetting::set('video_audio', $request->boolean('video_audio') ? '1' : '0');

        if (isset($data['why_us'])) {
            SiteSetting::set('home.why_us', json_encode(
                SiteSetting::normalizeWhyUs($data['why_us']),
                JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES,
            ));
        }

        return back()->with('success', __('admin.messages.saved'));
    }
}
