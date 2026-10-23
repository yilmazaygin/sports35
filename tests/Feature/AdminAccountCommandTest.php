<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminAccountCommandTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_account_can_be_created_from_the_server(): void
    {
        $this->artisan('admin:create', [
            'name' => 'Ada Admin',
            'email' => 'Ada@Example.com',
            '--password' => 'password123',
        ])->assertSuccessful();

        $user = User::query()->where('email', 'ada@example.com')->firstOrFail();
        $this->assertSame('Ada Admin', $user->name);
        $this->assertTrue($user->is_active);
        $this->assertTrue(Hash::check('password123', $user->password));
    }

    public function test_create_rejects_a_duplicate_email_and_a_short_password(): void
    {
        User::factory()->create(['email' => 'ada@example.com']);

        $this->artisan('admin:create', [
            'name' => 'Ada Admin',
            'email' => 'ada@example.com',
            '--password' => 'password123',
        ])->assertFailed();

        $this->artisan('admin:create', [
            'name' => 'Ada Admin',
            'email' => 'new@example.com',
            '--password' => 'short',
        ])->assertFailed();

        $this->assertDatabaseMissing('users', ['email' => 'new@example.com']);
    }

    public function test_password_can_be_changed_from_the_server(): void
    {
        $user = User::factory()->create(['email' => 'ada@example.com']);

        $this->artisan('admin:password', [
            'email' => 'ada@example.com',
            '--password' => 'new-password',
        ])->assertSuccessful();

        $this->assertTrue(Hash::check('new-password', $user->fresh()->password));
    }

    public function test_password_command_fails_for_an_unknown_account(): void
    {
        $this->artisan('admin:password', [
            'email' => 'missing@example.com',
            '--password' => 'password123',
        ])->assertFailed();
    }

    public function test_account_can_be_deleted_when_another_active_admin_remains(): void
    {
        $user = User::factory()->create(['email' => 'ada@example.com']);
        User::factory()->create(['email' => 'other@example.com']);

        $this->artisan('admin:delete', [
            'email' => 'ada@example.com',
            '--force' => true,
        ])->assertSuccessful();

        $this->assertDatabaseMissing('users', ['id' => $user->id]);
    }

    public function test_last_active_admin_cannot_be_deleted(): void
    {
        User::factory()->create(['email' => 'ada@example.com', 'is_active' => true]);

        $this->artisan('admin:delete', [
            'email' => 'ada@example.com',
            '--force' => true,
        ])->assertFailed();

        $this->assertDatabaseHas('users', ['email' => 'ada@example.com']);
    }

    public function test_delete_asks_for_confirmation(): void
    {
        User::factory()->create(['email' => 'ada@example.com']);
        User::factory()->create(['email' => 'other@example.com']);

        $this->artisan('admin:delete', ['email' => 'ada@example.com'])
            ->expectsConfirmation('Delete ada@example.com?', 'no')
            ->assertSuccessful();

        $this->assertDatabaseHas('users', ['email' => 'ada@example.com']);
    }
}
