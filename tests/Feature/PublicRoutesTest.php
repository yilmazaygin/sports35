<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicRoutesTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed();
    }

    public function test_core_public_pages_render(): void
    {
        $this->get('/')->assertOk();
        $this->get('/hizmetler')->assertOk();
        $this->get('/ucretsiz-deneme')->assertOk();
    }

    public function test_admin_login_page_is_available_at_the_admin_path(): void
    {
        $this->get('/admin/login')->assertOk();
    }
}
