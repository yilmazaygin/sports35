<?php

namespace Tests\Feature;

use App\Models\AuditLog;
use App\Models\Lead;
use App\Models\Trainer;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class Phase3BTest extends TestCase
{
    use RefreshDatabase;

    public function test_roles_are_enforced_on_restricted_routes(): void
    {
        $manager = User::factory()->create(['role' => 'manager']);
        $editor = User::factory()->create(['role' => 'content_editor']);

        $this->actingAs($manager)->get('/admin/site-settings')->assertForbidden();
        $this->actingAs($editor)->get('/admin/leads')->assertForbidden();
        $this->actingAs($manager)->get('/admin/leads')->assertOk();
    }

    public function test_disabled_user_cannot_login(): void
    {
        $user = User::factory()->create(['email' => 'disabled@example.com', 'password' => Hash::make('password'), 'is_active' => false]);

        $this->post('/admin/login', ['email' => $user->email, 'password' => 'password'])
            ->assertSessionHasErrors('email');
        $this->assertGuest();
    }

    public function test_owner_can_create_staff_but_last_owner_cannot_be_removed(): void
    {
        $owner = User::factory()->create(['role' => 'owner']);

        $this->actingAs($owner)->post('/admin/admin-users', [
            'name' => 'Content Editor', 'email' => 'editor@example.com', 'role' => 'content_editor',
            'password' => 'password123', 'password_confirmation' => 'password123',
        ])->assertRedirect();
        $this->assertDatabaseHas('users', ['email' => 'editor@example.com', 'role' => 'content_editor']);

        $this->actingAs($owner)->put('/admin/admin-users/'.$owner->id, [
            'name' => $owner->name, 'email' => $owner->email, 'role' => 'manager', 'is_active' => true,
        ])->assertRedirect();
        $this->assertDatabaseHas('users', ['id' => $owner->id, 'role' => 'owner', 'is_active' => true]);
    }

    public function test_audit_log_records_safe_changes_without_lead_contact_or_note(): void
    {
        $owner = User::factory()->create(['role' => 'owner']);
        $lead = Lead::create(['first_name' => 'Private', 'last_name' => 'Lead', 'email' => 'private@example.com', 'phone' => '05550000000', 'status' => 'new']);

        $this->actingAs($owner)->put('/admin/leads/'.$lead->id, ['status' => 'contacted', 'note' => 'Sensitive internal note'])->assertRedirect();

        $log = AuditLog::query()->where('auditable_type', Lead::class)->latest('id')->firstOrFail();
        $this->assertSame($owner->id, $log->user_id);
        $this->assertTrue($log->changes['note_changed']);
        $this->assertArrayNotHasKey('email', $log->changes);
        $this->assertArrayNotHasKey('phone', $log->changes);
        $this->assertArrayNotHasKey('note', $log->changes);
    }

    public function test_trainer_listing_is_paginated_server_side(): void
    {
        $owner = User::factory()->create(['role' => 'owner']);
        foreach (range(1, 21) as $i) {
            Trainer::create(['name' => 'Trainer '.$i, 'sort_order' => $i, 'is_active' => true]);
        }

        $response = $this->actingAs($owner)->get('/admin/trainers?search=No-match');

        $response->assertOk();
        $this->assertStringContainsString('pagination', $response->getContent());
    }
}
