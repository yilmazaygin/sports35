<?php

namespace Tests\Feature;

use App\Models\ConversionEvent;
use App\Models\Lead;
use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class Phase2BTest extends TestCase
{
    use RefreshDatabase;

    public function test_first_touch_attribution_survives_navigation_and_is_saved_on_lead(): void
    {
        $this->get('/?utm_source=instagram&utm_campaign=summer&cta_source=hero');
        $this->get('/hizmetler?utm_source=other');

        $this->post('/ucretsiz-deneme', [
            'first_name' => 'Ada', 'last_name' => 'Test', 'phone' => '05550000000', 'email' => 'ada@example.com',
            'privacy_consent' => true, 'marketing_consent' => false,
        ])->assertRedirect();

        $lead = Lead::query()->latest('id')->firstOrFail();
        $this->assertSame('/', $lead->landing_page);
        $this->assertSame('instagram', $lead->utm_source);
        $this->assertSame('summer', $lead->utm_campaign);
        $this->assertSame('hero', $lead->cta_source);
        $this->assertDatabaseHas('conversion_events', ['event_type' => 'free_trial_form_submitted']);
    }

    public function test_conversion_events_accept_only_public_event_types(): void
    {
        $this->postJson('/analytics/events', ['event_type' => 'whatsapp_click', 'cta_source' => 'footer'])->assertCreated();
        $this->assertDatabaseHas('conversion_events', ['event_type' => 'whatsapp_click', 'cta_source' => 'footer']);
    }

    public function test_testimonial_crud_and_empty_public_state(): void
    {
        $this->get('/')->assertOk();
        $this->assertCount(0, Testimonial::all());

        $user = User::factory()->create();
        $response = $this->actingAs($user)->post('/admin/testimonials', [
            'name' => 'Gerçek Üye', 'quote_tr' => 'Harika salon.', 'quote_en' => 'Great gym.', 'is_active' => true, 'sort_order' => 1,
        ]);
        $response->assertRedirect();
        $this->assertDatabaseHas('testimonials', ['name' => 'Gerçek Üye']);

        $testimonial = Testimonial::firstOrFail();
        $this->actingAs($user)->put('/admin/testimonials/'.$testimonial->id, ['name' => 'Güncel Üye', 'quote_tr' => 'Güncel.', 'is_active' => false, 'sort_order' => 1])->assertRedirect();
        $this->assertDatabaseHas('testimonials', ['name' => 'Güncel Üye', 'is_active' => false]);
        $this->actingAs($user)->delete('/admin/testimonials/'.$testimonial->id)->assertRedirect();
        $this->assertDatabaseMissing('testimonials', ['id' => $testimonial->id]);
    }
}
