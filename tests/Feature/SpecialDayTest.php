<?php

namespace Tests\Feature;

use App\Models\SpecialDay;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SpecialDayTest extends TestCase
{
    use RefreshDatabase;

    protected function tearDown(): void
    {
        Carbon::setTestNow();

        parent::tearDown();
    }

    public function test_a_single_day_accepts_only_one_notice(): void
    {
        $owner = User::factory()->create();
        $payload = [
            'starts_on' => '2026-10-22',
            'message_tr' => 'Salonumuz kapalıdır',
            'message_en' => 'The gym is closed',
            'show_banner' => true,
            'is_active' => true,
        ];

        $this->actingAs($owner)->post('/admin/special-days', $payload)->assertRedirect();

        $this->assertDatabaseHas('special_days', [
            'starts_on' => '2026-10-22 00:00:00',
            'ends_on' => '2026-10-22 00:00:00',
            'message_tr' => 'Salonumuz kapalıdır',
        ]);

        $this->actingAs($owner)
            ->post('/admin/special-days', [
                ...$payload,
                'ends_on' => '2026-10-22',
                'message_tr' => 'İkinci mesaj',
                'message_en' => 'Second message',
            ])
            ->assertSessionHasErrors('ends_on');

        $this->assertSame(1, SpecialDay::query()->count());
    }

    public function test_a_date_range_shows_one_notice_on_every_day_and_rejects_overlaps(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-10-23 12:00:00', 'Europe/Istanbul'));
        $owner = User::factory()->create();

        $this->actingAs($owner)->post('/admin/special-days', [
            'starts_on' => '2026-10-22',
            'ends_on' => '2026-10-24',
            'message_tr' => 'Bu tarihler arası bayram sebebiyle kapalıdır.',
            'message_en' => 'Closed for the holiday during these dates.',
            'show_banner' => true,
            'is_active' => true,
        ])->assertRedirect();

        $this->get('/')->assertOk()->assertInertia(fn ($page) => $page
            ->where('alert.message', 'Bu tarihler arası bayram sebebiyle kapalıdır.'));

        Carbon::setTestNow(Carbon::parse('2026-10-25 12:00:00', 'Europe/Istanbul'));

        $this->get('/')->assertOk()->assertInertia(fn ($page) => $page->where('alert', null));

        $this->actingAs($owner)->post('/admin/special-days', [
            'starts_on' => '2026-10-24',
            'ends_on' => '2026-10-26',
            'message_tr' => 'Çakışan uyarı',
            'message_en' => 'Overlapping notice',
            'show_banner' => true,
            'is_active' => true,
        ])->assertSessionHasErrors('ends_on');

        $this->actingAs($owner)->post('/admin/special-days', [
            'starts_on' => '2026-10-25',
            'ends_on' => '2026-10-26',
            'message_tr' => 'Bayramın üçüncü gününden itibaren çalışmaya devam edecektir.',
            'message_en' => 'We reopen from the third day of the holiday.',
            'show_banner' => true,
            'is_active' => true,
        ])->assertRedirect();

        $first = SpecialDay::query()->whereDate('starts_on', '2026-10-22')->first();

        $this->actingAs($owner)
            ->put('/admin/special-days/'.$first->id, [
                'starts_on' => '2026-10-22',
                'ends_on' => '2026-10-25',
                'message_tr' => 'Bu tarihler arası bayram sebebiyle kapalıdır.',
                'message_en' => 'Closed for the holiday during these dates.',
                'show_banner' => true,
                'is_active' => true,
            ])
            ->assertSessionHasErrors('ends_on');

        $this->actingAs($owner)
            ->get('/admin/special-days')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admin/SpecialDays/Index')
                ->has('specialDays', 2)
                ->where('specialDays.0.starts_on', '2026-10-25')
                ->where('specialDays.0.ends_on', '2026-10-26')
                ->where('specialDays.1.starts_on', '2026-10-22')
                ->where('specialDays.1.ends_on', '2026-10-24'));
    }
}
