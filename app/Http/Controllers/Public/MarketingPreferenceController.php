<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Carbon;

class MarketingPreferenceController extends Controller
{
    public function unsubscribe(string $token): RedirectResponse
    {
        $lead = Lead::where('unsubscribe_token', $token)->firstOrFail();

        if ($lead->marketing_opt_in) {
            $lead->update([
                'marketing_opt_in' => false,
                'marketing_opt_out_at' => Carbon::now(),
            ]);
            $lead->consents()->create([
                'consent_type' => 'marketing',
                'granted' => false,
                'source' => 'unsubscribe_link',
                'given_at' => now(),
            ]);
        }

        return redirect()->route('free-trial.create')->with('success', __('public.free_trial.unsubscribed'));
    }
}
