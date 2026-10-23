<?php

namespace Tests\Feature;

use App\Models\AuditLog;
use App\Models\Facility;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class Phase3BTest extends TestCase
{
    use RefreshDatabase;

    public function test_active_admins_can_open_every_panel_and_cannot_manage_accounts_there(): void
    {
        $admin = User::factory()->create();

        $this->actingAs($admin)->get('/admin/site-settings')->assertOk();
        $this->actingAs($admin)->get('/admin/audit-logs')->assertOk();
        $this->actingAs($admin)->get('/admin/campaigns')->assertOk();
        $this->actingAs($admin)->get('/admin/admin-users')->assertNotFound();
        $this->actingAs($admin)->post('/admin/admin-users', [
            'name' => 'Other',
            'email' => 'other@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ])->assertStatus(405);
        $this->assertDatabaseMissing('users', ['email' => 'other@example.com']);
    }

    public function test_disabled_user_cannot_login(): void
    {
        $user = User::factory()->create(['email' => 'disabled@example.com', 'password' => Hash::make('password'), 'is_active' => false]);

        $this->post('/admin/login', ['email' => $user->email, 'password' => 'password'])
            ->assertSessionHasErrors('email');
        $this->assertGuest();
    }

    public function test_audit_log_records_content_changes(): void
    {
        $owner = User::factory()->create();
        $facility = Facility::create(['name_tr' => 'Kardiyo', 'name_en' => 'Cardio', 'category' => 'cardio', 'sort_order' => 1, 'is_active' => true]);

        $this->actingAs($owner)->put('/admin/facilities/'.$facility->id, [
            'name_tr' => 'Kardiyo',
            'name_en' => 'Cardio',
            'category' => 'cardio',
            'sort_order' => 4,
            'is_active' => true,
        ])->assertRedirect();

        $log = AuditLog::query()->where('auditable_type', Facility::class)->where('action', 'updated')->latest('id')->firstOrFail();
        $this->assertSame($owner->id, $log->user_id);
        $this->assertSame(4, (int) $log->changes['sort_order']);
        $this->assertArrayNotHasKey('email', $log->changes);
        $this->assertArrayNotHasKey('phone', $log->changes);
    }

    public function test_facility_listing_is_paginated_server_side(): void
    {
        $owner = User::factory()->create();
        foreach (range(1, 21) as $i) {
            Facility::create(['name_tr' => 'Alan '.$i, 'name_en' => 'Area '.$i, 'category' => 'other', 'sort_order' => $i, 'is_active' => true]);
        }

        $response = $this->actingAs($owner)->get('/admin/facilities?search=No-match');

        $response->assertOk();
        $this->assertStringContainsString('pagination', $response->getContent());
    }
}
