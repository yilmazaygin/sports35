<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\WorkingHour;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WorkingHoursLayoutTest extends TestCase
{
    use RefreshDatabase;

    public function test_owner_saves_hours_as_weekdays_saturday_and_sunday(): void
    {
        $owner = User::factory()->create();
        $this->seedHours();

        $this->actingAs($owner)->put('/admin/working-hours', [
            'layout' => 'split',
            'groups' => [
                ['key' => 'weekday', 'opens_at' => '06:00', 'closes_at' => '23:00', 'is_closed' => false],
                ['key' => 'saturday', 'opens_at' => '09:00', 'closes_at' => '18:00', 'is_closed' => false],
                ['key' => 'sunday', 'opens_at' => '10:00', 'closes_at' => '16:00', 'is_closed' => false],
            ],
        ])->assertRedirect();

        $this->assertSame('split', WorkingHour::layout());
        $this->assertSame('06:00', substr((string) WorkingHour::where('day_key', 'friday')->first()->opens_at, 0, 5));
        $this->assertSame('10:00', substr((string) WorkingHour::where('day_key', 'sunday')->first()->opens_at, 0, 5));

        $this->get('/')->assertOk()->assertInertia(fn ($page) => $page
            ->where('workingHours.layout', 'split')
            ->where('workingHours.days.6.hours', '10:00 - 16:00')
        );
    }

    public function test_weekend_layout_applies_one_schedule_to_saturday_and_sunday(): void
    {
        $owner = User::factory()->create();
        $this->seedHours();

        $this->actingAs($owner)->put('/admin/working-hours', [
            'layout' => 'weekend',
            'groups' => [
                ['key' => 'weekday', 'opens_at' => '07:00', 'closes_at' => '22:00', 'is_closed' => false],
                ['key' => 'weekend', 'opens_at' => '09:00', 'closes_at' => '17:00', 'is_closed' => false],
            ],
        ])->assertRedirect();

        $this->assertSame('09:00', substr((string) WorkingHour::where('day_key', 'saturday')->first()->opens_at, 0, 5));
        $this->assertSame('09:00', substr((string) WorkingHour::where('day_key', 'sunday')->first()->opens_at, 0, 5));
    }

    private function seedHours(): void
    {
        foreach (['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as $index => $day) {
            WorkingHour::create([
                'day_key' => $day,
                'opens_at' => '08:00',
                'closes_at' => '20:00',
                'is_closed' => false,
                'sort_order' => $index + 1,
            ]);
        }
    }
}
