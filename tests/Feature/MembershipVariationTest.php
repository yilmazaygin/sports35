<?php

namespace Tests\Feature;

use App\Models\MembershipPackage;
use App\Models\MembershipPriceVariation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MembershipVariationTest extends TestCase
{
    use RefreshDatabase;

    public function test_variation_prices_are_optional_per_duration(): void
    {
        $owner = User::factory()->create();
        $oneMonth = MembershipPackage::create(['duration_months' => 1, 'price' => 1500, 'sort_order' => 1, 'is_active' => true]);
        $threeMonths = MembershipPackage::create(['duration_months' => 3, 'price' => 4000, 'sort_order' => 2, 'is_active' => true]);
        MembershipPackage::create(['duration_months' => 6, 'price' => 7500, 'sort_order' => 3, 'is_active' => true]);

        $this->actingAs($owner)->post('/admin/membership-packages/variations', [
            'name_tr' => 'Kadın fiyatları',
            'name_en' => 'Women\'s prices',
        ])->assertRedirect();

        $variation = MembershipPriceVariation::query()->firstOrFail();

        $this->actingAs($owner)->put('/admin/membership-packages/'.$threeMonths->id, [
            'duration_months' => 3,
            'price' => 4000,
            'is_active' => true,
            'sort_order' => 2,
            'variation_prices' => [
                $variation->id => 3200,
            ],
        ])->assertRedirect();

        $this->actingAs($owner)->put('/admin/membership-packages/'.$oneMonth->id, [
            'duration_months' => 1,
            'price' => 1500,
            'is_active' => true,
            'sort_order' => 1,
            'variation_prices' => [
                $variation->id => '',
            ],
        ])->assertRedirect();

        $this->get('/')->assertOk()->assertInertia(fn ($page) => $page
            ->where('pricing.variations.0.name', 'Kadın fiyatları')
            ->where('pricing.packages.0.variation_prices.'.$variation->id, null)
            ->where('pricing.packages.1.variation_prices.'.$variation->id, 3200)
            ->where('pricing.packages.2.variation_prices.'.$variation->id, null)
        );

        $this->withSession(['locale' => 'en'])->get('/')->assertInertia(fn ($page) => $page
            ->where('pricing.variations.0.name', 'Women\'s prices')
        );
    }

    public function test_creating_a_variation_saves_optional_prices_for_existing_durations(): void
    {
        $owner = User::factory()->create();
        $oneMonth = MembershipPackage::create(['duration_months' => 1, 'price' => 1500, 'sort_order' => 1, 'is_active' => true]);
        $threeMonths = MembershipPackage::create(['duration_months' => 3, 'price' => 4000, 'sort_order' => 2, 'is_active' => true]);

        $this->actingAs($owner)->post('/admin/membership-packages/variations', [
            'name_tr' => 'Öğrenci',
            'name_en' => 'Student',
            'package_prices' => [
                $oneMonth->id => 1200,
                $threeMonths->id => '',
                9999 => 500,
            ],
        ])->assertRedirect();

        $variation = MembershipPriceVariation::query()->firstOrFail();
        $saved = $variation->prices()->pluck('price', 'membership_package_id');

        $this->assertEquals(1200, (float) $saved[$oneMonth->id]);
        $this->assertFalse($saved->has($threeMonths->id));
        $this->assertFalse($saved->has(9999));
    }

    public function test_variation_order_and_inactive_state_control_the_homepage(): void
    {
        $owner = User::factory()->create();
        MembershipPackage::create(['duration_months' => 1, 'price' => 1500, 'sort_order' => 1, 'is_active' => true]);
        $student = MembershipPriceVariation::create(['name_tr' => 'Öğrenci', 'name_en' => 'Student', 'sort_order' => 1, 'is_active' => true]);
        $women = MembershipPriceVariation::create(['name_tr' => 'Kadın', 'name_en' => 'Women', 'sort_order' => 2, 'is_active' => true]);

        $this->get('/')->assertInertia(fn ($page) => $page
            ->where('pricing.variations.0.name', 'Öğrenci')
            ->where('pricing.variations.1.name', 'Kadın')
        );

        $this->actingAs($owner)->post('/admin/membership-packages/variations/'.$student->id.'/move', [
            'direction' => 'down',
        ])->assertRedirect();

        $this->assertSame(1, $women->fresh()->sort_order);
        $this->assertSame(2, $student->fresh()->sort_order);

        $this->get('/')->assertInertia(fn ($page) => $page
            ->where('pricing.variations.0.name', 'Kadın')
            ->where('pricing.variations.1.name', 'Öğrenci')
        );

        $this->actingAs($owner)->patch('/admin/membership-packages/variations/'.$women->id.'/active', [
            'is_active' => false,
        ])->assertRedirect();

        $this->assertFalse($women->fresh()->is_active);

        $this->get('/')->assertInertia(fn ($page) => $page
            ->has('pricing.variations', 1)
            ->where('pricing.variations.0.name', 'Öğrenci')
            ->where('pricing.packages.0.price', 1500)
        );
    }

    public function test_home_has_no_variations_when_none_exist(): void
    {
        MembershipPackage::create(['duration_months' => 1, 'price' => 1500, 'sort_order' => 1, 'is_active' => true]);

        $this->get('/')->assertInertia(fn ($page) => $page
            ->has('pricing.variations', 0)
            ->where('pricing.packages.0.price', 1500)
        );
    }
}
