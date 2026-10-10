<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreFreeTrialRequest;
use App\Mail\FreeTrialSubmitted;
use App\Models\Lead;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class FreeTrialController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Public/FreeTrial/Index');
    }

    public function store(StoreFreeTrialRequest $request): RedirectResponse
    {
        $data = $request->validated();
        unset($data['privacy_consent'], $data['marketing_consent'], $data['website']);

        $duplicate = Lead::query()
            ->where('email', Str::lower($data['email']))
            ->where('phone', $data['phone'])
            ->where('created_at', '>=', Carbon::now()->subMinutes(10))
            ->latest()
            ->first();

        if ($duplicate) {
            return back()->with('success', __('public.free_trial.success'));
        }

        $marketingOptIn = $request->boolean('marketing_consent');
        $attribution = $request->session()->get('first_touch_attribution', []);
        $lead = Lead::create([
            ...$data,
            'email' => Str::lower($data['email']),
            'source' => 'free_trial_form',
            ...array_intersect_key($attribution, array_flip([
                'landing_page', 'referrer', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'cta_source',
            ])),
            'status' => 'new',
            'marketing_opt_in' => $marketingOptIn,
            'marketing_opt_in_at' => $marketingOptIn ? now() : null,
        ]);

        $metadata = [
            'source' => 'free_trial_form',
            'version' => 'placeholder-v1',
            'ip_address' => $request->ip(),
            'user_agent' => Str::limit((string) $request->userAgent(), 1000, ''),
            'given_at' => now(),
        ];

        $lead->consents()->createMany([
            [...$metadata, 'consent_type' => 'privacy_processing', 'granted' => true],
            [...$metadata, 'consent_type' => 'marketing', 'granted' => $marketingOptIn],
        ]);

        try {
            Mail::to($lead->email)->send(new FreeTrialSubmitted($lead));
        } catch (\Throwable) {
            // Lead capture must remain successful when local mail transport is unavailable.
        }

        app(\App\Services\ConversionEventService::class)->record($request, 'free_trial_form_submitted');

        return back()->with('success', __('public.free_trial.success'));
    }
}
