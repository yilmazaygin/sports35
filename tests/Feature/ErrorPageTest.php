<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Route;
use RuntimeException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Tests\TestCase;

class ErrorPageTest extends TestCase
{
    use RefreshDatabase;

    public function test_missing_public_pages_render_the_branded_not_found_page(): void
    {
        $this->get('/bu-sayfa-yok')
            ->assertNotFound()
            ->assertHeader('X-Robots-Tag', 'noindex')
            ->assertInertia(fn ($page) => $page
                ->component('Error')
                ->where('status', 404)
                ->where('translations.public.error_pages.404.title', 'Sayfa bulunamadı'));
    }

    public function test_english_visitors_see_the_translated_not_found_page(): void
    {
        $this->withSession(['locale' => 'en'])
            ->get('/bu-sayfa-yok')
            ->assertNotFound()
            ->assertInertia(fn ($page) => $page
                ->where('locale', 'en')
                ->where('translations.public.error_pages.404.title', 'Page not found')
                ->where('translations.public.error_pages.home', 'Back to home'));
    }

    public function test_inertia_visits_receive_the_error_page_instead_of_an_html_modal(): void
    {
        $version = file_exists(public_path('build/manifest.json'))
            ? hash_file('xxh128', public_path('build/manifest.json'))
            : '';

        $this->withHeaders([
            'X-Inertia' => 'true',
            'X-Inertia-Version' => $version,
            'X-Requested-With' => 'XMLHttpRequest',
        ])->get('/bu-sayfa-yok')
            ->assertNotFound()
            ->assertHeader('X-Inertia', 'true')
            ->assertJsonPath('component', 'Error')
            ->assertJsonPath('props.status', 404);
    }

    public function test_json_clients_keep_a_non_inertia_response(): void
    {
        $this->getJson('/bu-sayfa-yok')
            ->assertNotFound()
            ->assertHeaderMissing('X-Inertia')
            ->assertSee('Sayfa bulunamadı');
    }

    public function test_forbidden_admin_pages_use_the_error_page(): void
    {
        $editor = User::factory()->create(['is_active' => false]);

        $this->actingAs($editor)
            ->get('/admin/site-settings')
            ->assertForbidden()
            ->assertInertia(fn ($page) => $page
                ->component('Error')
                ->where('status', 403)
                ->where('translations.public.error_pages.403.title', 'Bu alana erişilemiyor'));
    }

    public function test_expired_and_unavailable_responses_use_their_own_copy(): void
    {
        Route::middleware('web')->get('/_errors/expired', fn () => abort(419));
        Route::middleware('web')->get('/_errors/limited', fn () => abort(429));
        Route::middleware('web')->get('/_errors/down', fn () => abort(503));

        $this->get('/_errors/expired')
            ->assertStatus(419)
            ->assertInertia(fn ($page) => $page->component('Error')->where('status', 419));

        $this->get('/_errors/limited')
            ->assertStatus(429)
            ->assertInertia(fn ($page) => $page->component('Error')->where('status', 429));

        $this->get('/_errors/down')
            ->assertStatus(503)
            ->assertInertia(fn ($page) => $page
                ->component('Error')
                ->where('status', 503)
                ->where('translations.public.error_pages.503.title', 'Kısa bir ara'));
    }

    public function test_other_client_errors_use_the_shared_fallback_copy(): void
    {
        Route::middleware('web')->get('/_errors/method', fn () => 'ok');

        $this->post('/_errors/method')
            ->assertStatus(405)
            ->assertInertia(fn ($page) => $page
                ->component('Error')
                ->where('status', 405)
                ->where('translations.public.error_pages.fallback.title', 'Bu istek tamamlanamadı'));
    }

    public function test_server_errors_hide_exception_details_until_debug_mode(): void
    {
        Route::middleware('web')->get('/_errors/boom', function () {
            throw new RuntimeException('secret failure');
        });

        config(['app.debug' => false]);

        $this->get('/_errors/boom')
            ->assertStatus(500)
            ->assertInertia(fn ($page) => $page->component('Error')->where('status', 500))
            ->assertDontSee('secret failure');

        config(['app.debug' => true]);

        $this->get('/_errors/boom')
            ->assertStatus(500)
            ->assertHeaderMissing('X-Inertia')
            ->assertSee('secret failure');
    }

    public function test_maintenance_mode_uses_the_branded_unavailable_page(): void
    {
        try {
            $this->artisan('down')->assertOk();

            $this->get('/')
                ->assertStatus(503)
                ->assertInertia(fn ($page) => $page
                    ->component('Error')
                    ->where('status', 503)
                    ->where('translations.public.error_pages.503.title', 'Kısa bir ara'));
        } finally {
            $this->artisan('up');
        }
    }

    public function test_static_error_view_renders_without_the_javascript_app(): void
    {
        $this->view('errors.page', ['status' => 404])
            ->assertSee('Sayfa bulunamadı')
            ->assertSee('Ana sayfaya dön')
            ->assertSee('data-error-page="404"', false);

        $this->view('errors.4xx', ['exception' => new NotFoundHttpException])
            ->assertSee('Sayfa bulunamadı')
            ->assertSee('>404<', false);

        app()->setLocale('en');

        $this->view('errors.503')
            ->assertSee('We will be right back')
            ->assertSee('Try again');
    }
}
