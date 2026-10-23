<?php

namespace Tests\Feature;

use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BlogVisibilityTest extends TestCase
{
    use RefreshDatabase;

    public function test_blog_stays_visible_on_the_homepage_until_it_is_switched_off(): void
    {
        $this->get('/')->assertOk();
        $this->assertTrue(SiteSetting::blogEnabled());

        $admin = User::factory()->create();

        $this->actingAs($admin)
            ->put('/admin/blog-settings', ['enabled' => false])
            ->assertRedirect();

        $this->assertFalse(SiteSetting::blogEnabled());
        $this->get('/')->assertOk()->assertSee('&quot;blogEnabled&quot;:false', false);
        $this->get('/blog')->assertNotFound();

        $this->actingAs($admin)
            ->put('/admin/blog-settings', ['enabled' => true])
            ->assertRedirect();

        $this->assertTrue(SiteSetting::blogEnabled());
        $this->get('/')->assertOk()->assertSee('&quot;blogEnabled&quot;:true', false);
    }
}
