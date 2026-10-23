<?php

namespace Tests\Feature;

use App\Models\Campaign;
use App\Models\MembershipPackage;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CampaignTest extends TestCase
{
    use RefreshDatabase;

    protected function tearDown(): void
    {
        Carbon::setTestNow();

        parent::tearDown();
    }

    public function test_campaign_is_announced_without_changing_prices(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-10-22 12:00:00', 'Europe/Istanbul'));
        $owner = User::factory()->create();
        MembershipPackage::create(['duration_months' => 1, 'price' => 1500, 'sort_order' => 1, 'is_active' => true]);

        $this->actingAs($owner)->post('/admin/campaigns', [
            'title_tr' => 'Arkadaşını getir',
            'title_en' => 'Bring a friend',
            'body_tr' => 'Arkadaşını getir, 20 gün kazan.',
            'body_en' => 'Bring a friend and earn 20 days.',
            'starts_on' => '2026-10-22',
            'ends_on' => '2026-10-31',
        ])->assertRedirect();

        $this->assertDatabaseHas('campaigns', [
            'title_tr' => 'Arkadaşını getir',
            'title_en' => 'Bring a friend',
            'is_active' => true,
        ]);

        $this->get('/')->assertOk()->assertInertia(fn ($page) => $page
            ->has('pricing.offers', 1)
            ->where('pricing.offers.0.title', 'Arkadaşını getir')
            ->where('pricing.offers.0.body', 'Arkadaşını getir, 20 gün kazan.')
            ->where('pricing.packages.0.price', 1500)
        );

        $this->withSession(['locale' => 'en'])->get('/')->assertInertia(fn ($page) => $page
            ->where('pricing.offers.0.title', 'Bring a friend')
            ->where('pricing.offers.0.body', 'Bring a friend and earn 20 days.')
        );
    }

    public function test_campaign_stays_active_through_the_end_of_its_end_date(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-10-22 23:30:00', 'Europe/Istanbul'));
        Campaign::create([
            'title_tr' => 'Kadın üyelik',
            'title_en' => 'Women membership',
            'body_tr' => 'Bir ay alana bir ay bedava.',
            'body_en' => 'Buy one month, get one free.',
            'starts_on' => '2026-10-01',
            'ends_on' => '2026-10-22',
            'is_active' => true,
        ]);

        $this->get('/')->assertInertia(fn ($page) => $page->has('pricing.offers', 1));
    }

    public function test_finished_campaign_becomes_inactive_and_stays_in_the_admin_archive(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-10-23 00:30:00', 'Europe/Istanbul'));
        $admin = User::factory()->create();
        $campaign = Campaign::create([
            'title_tr' => 'Eski kampanya',
            'title_en' => 'Past campaign',
            'body_tr' => 'Süresi doldu.',
            'body_en' => 'This offer has ended.',
            'starts_on' => '2026-10-01',
            'ends_on' => '2026-10-22',
            'is_active' => true,
        ]);

        $this->get('/')->assertInertia(fn ($page) => $page->has('pricing.offers', 0));
        $this->assertFalse($campaign->fresh()->is_active);

        $this->actingAs($admin)->get('/admin/campaigns')->assertInertia(fn ($page) => $page
            ->has('campaigns', 0)
            ->has('pastCampaigns', 1)
            ->where('pastCampaigns.0.title_tr', 'Eski kampanya')
        );
    }
}
