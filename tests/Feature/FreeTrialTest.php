<?php

namespace Tests\Feature;

use App\Mail\FreeTrialSubmitted;
use App\Models\Lead;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class FreeTrialTest extends TestCase
{
    use RefreshDatabase;

    public function test_free_trial_request_requires_privacy_consent_and_keeps_marketing_optional(): void
    {
        $response = $this->post('/ucretsiz-deneme', [
            'first_name' => 'Ayşe',
            'last_name' => 'Test',
            'phone' => '+90 555 111 22 33',
            'email' => 'ayse@example.com',
        ]);

        $response->assertSessionHasErrors('privacy_consent');
        $this->assertDatabaseCount('leads', 0);
    }

    public function test_free_trial_request_records_separate_consents_and_sends_transactional_email(): void
    {
        Mail::fake();

        $response = $this->post('/ucretsiz-deneme', [
            'first_name' => 'Ayşe',
            'last_name' => 'Test',
            'phone' => '+90 555 111 22 33',
            'email' => 'AYSE@example.com',
            'interested_service' => 'Strength',
            'privacy_consent' => true,
            'marketing_consent' => false,
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');
        $lead = Lead::firstOrFail();

        $this->assertSame('ayse@example.com', $lead->email);
        $this->assertFalse($lead->marketing_opt_in);
        $this->assertDatabaseHas('lead_consents', ['lead_id' => $lead->id, 'consent_type' => 'privacy_processing', 'granted' => true]);
        $this->assertDatabaseHas('lead_consents', ['lead_id' => $lead->id, 'consent_type' => 'marketing', 'granted' => false]);
        Mail::assertSent(FreeTrialSubmitted::class, fn (FreeTrialSubmitted $mail) => $mail->lead->is($lead));

        $this->post('/ucretsiz-deneme', [
            'first_name' => 'Ayşe', 'last_name' => 'Test', 'phone' => '+90 555 111 22 33',
            'email' => 'ayse@example.com', 'privacy_consent' => true,
        ]);

        $this->assertDatabaseCount('leads', 1);
    }
}
