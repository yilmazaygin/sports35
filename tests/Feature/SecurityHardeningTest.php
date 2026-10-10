<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class SecurityHardeningTest extends TestCase
{
    use RefreshDatabase;

    public function test_final_active_owner_cannot_delete_their_account(): void
    {
        $owner = User::factory()->create([
            'role' => 'owner',
            'password' => Hash::make('password'),
            'is_active' => true,
        ]);

        $this->actingAs($owner)
            ->delete('/admin/profile', ['password' => 'password'])
            ->assertRedirect();

        $this->assertDatabaseHas('users', ['id' => $owner->id, 'is_active' => true]);
        $this->assertAuthenticatedAs($owner);
    }

    public function test_owner_can_delete_their_account_when_another_active_owner_remains(): void
    {
        $owner = User::factory()->create([
            'role' => 'owner',
            'password' => Hash::make('password'),
            'is_active' => true,
        ]);
        User::factory()->create(['role' => 'owner', 'is_active' => true]);

        $this->actingAs($owner)
            ->delete('/admin/profile', ['password' => 'password'])
            ->assertRedirect('/');

        $this->assertDatabaseMissing('users', ['id' => $owner->id]);
    }

    public function test_svg_uploads_are_rejected_by_media_validation(): void
    {
        $owner = User::factory()->create(['role' => 'owner']);
        $svg = UploadedFile::fake()->create('badge.svg', 5, 'image/svg+xml');

        $this->actingAs($owner)
            ->post('/admin/media', ['file' => $svg])
            ->assertSessionHasErrors('file');
    }

    public function test_non_local_seeding_requires_explicit_owner_credentials(): void
    {
        $this->app->detectEnvironment(fn () => 'production');

        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('SPORTS35_OWNER_EMAIL');

        (new DatabaseSeeder())->run();
    }

    public function test_svg_content_disguised_as_a_supported_image_is_rejected(): void
    {
        $owner = User::factory()->create(['role' => 'owner']);
        $svg = UploadedFile::fake()->createWithContent('badge.jpg', '<svg xmlns="http://www.w3.org/2000/svg"></svg>');

        $this->actingAs($owner)
            ->post('/admin/media', ['file' => $svg])
            ->assertSessionHasErrors('file');
    }
}
