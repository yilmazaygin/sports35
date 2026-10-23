<?php

namespace Tests\Feature;

use App\Models\BlogPost;
use App\Models\GalleryItem;
use App\Models\SiteSetting;
use Database\Seeders\ContentSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use ReflectionProperty;
use Tests\TestCase;

class SearchDiscoveryTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $cache = new ReflectionProperty(SiteSetting::class, 'contactCache');
        $cache->setValue(null, null);
    }

    public function test_sitemap_lists_public_pages_images_and_only_live_posts(): void
    {
        BlogPost::create($this->blogPost('buca-antrenmani', 'Buca antrenmanı', now()->subDay()));
        BlogPost::create($this->blogPost('taslak-yazi', 'Taslak', now()->subDay(), false));
        BlogPost::create($this->blogPost('gelecek-yazi', 'Gelecek', now()->addDay()));
        GalleryItem::create([
            'image_path' => 'sports35/floor.jpg',
            'caption_tr' => 'Kardiyo alanı',
            'is_active' => true,
        ]);
        GalleryItem::create([
            'image_path' => 'sports35/hidden.jpg',
            'caption_tr' => 'Gizli kare',
            'is_active' => false,
        ]);

        $response = $this->get('/sitemap.xml');

        $response->assertOk();
        $response->assertHeader('Content-Type', 'application/xml; charset=UTF-8');
        $xml = $response->getContent();

        $this->assertNotFalse(simplexml_load_string($xml));
        $this->assertStringContainsString(route('home'), $xml);
        $this->assertStringContainsString(route('gallery'), $xml);
        $this->assertStringContainsString(route('cookies'), $xml);
        $this->assertStringContainsString(route('blog.index'), $xml);
        $this->assertStringContainsString(route('blog.show', 'buca-antrenmani'), $xml);
        $this->assertStringContainsString('sports35/floor.jpg', $xml);
        $this->assertStringContainsString('Kardiyo alanı', $xml);
        $this->assertStringNotContainsString('taslak-yazi', $xml);
        $this->assertStringNotContainsString('gelecek-yazi', $xml);
        $this->assertStringNotContainsString('hidden.jpg', $xml);
        $this->assertStringNotContainsString('/admin', $xml);
    }

    public function test_sitemap_omits_the_blog_when_it_is_switched_off(): void
    {
        BlogPost::create($this->blogPost('buca-antrenmani', 'Buca antrenmanı', now()->subDay()));
        SiteSetting::set('blog.enabled', '0');

        $xml = $this->get('/sitemap.xml')->assertOk()->getContent();

        $this->assertStringNotContainsString(route('blog.index'), $xml);
        $this->assertStringNotContainsString('buca-antrenmani', $xml);
        $this->assertStringContainsString(route('home'), $xml);
    }

    public function test_robots_allows_answer_engines_and_points_at_the_discovery_files(): void
    {
        $body = $this->get('/robots.txt')->assertOk()->getContent();

        $this->assertSame(1, substr_count($body, 'Allow: /'));
        $this->assertSame(1, substr_count($body, 'Disallow: /admin'));
        $this->assertStringContainsString("User-agent: *\nUser-agent: Googlebot\nUser-agent: Google-Extended", $body);
        $this->assertStringContainsString('Sitemap: '.route('sitemap'), $body);
        $this->assertStringContainsString(route('llms'), $body);
        $this->assertStringContainsString(route('llms.full'), $body);
        $this->assertLessThan(strpos($body, 'Disallow:'), strpos($body, 'User-agent: Google-Extended'));
    }

    public function test_llms_txt_describes_the_gym_without_keyword_stuffing(): void
    {
        $body = $this->get('/llms.txt')->assertOk()->getContent();

        $this->assertStringStartsWith('# '.SiteSetting::BUSINESS_NAME, $body);
        $this->assertStringContainsString('Sports35, İzmir’in Buca ilçesinde', $body);
        $this->assertStringNotContainsString('Buca spor salonu', $body);
        $this->assertStringNotContainsString('Şirinyer spor salonu', $body);
        $this->assertStringNotContainsString('İzmir spor salonu', $body);
        $this->assertStringContainsString('504/2', $body);
        $this->assertStringContainsString('+90 505 930 30 07', $body);
        $this->assertStringContainsString('38.3902341', $body);
        $this->assertStringContainsString('27.1484883', $body);
        $this->assertStringContainsString(route('home'), $body);
        $this->assertStringContainsString(route('llms.full'), $body);
        $this->assertStringNotContainsString('info@sports35.test', $body);
    }

    public function test_llms_full_includes_hours_prices_and_where_the_gym_is(): void
    {
        $this->seed(ContentSeeder::class);

        $body = $this->get('/llms-full.txt')->assertOk()->getContent();

        $this->assertStringContainsString('### Sports35 nerede?', $body);
        $this->assertStringNotContainsString('Şirinyer spor salonu', $body);
        $this->assertStringNotContainsString('İzmir spor salonu', $body);
        $this->assertStringContainsString('Pazartesi: 06:00–23:00', $body);
        $this->assertStringContainsString('1.500 TL', $body);
        $this->assertStringContainsString('near Şirinyer', $body);
    }

    public function test_homepage_html_exposes_the_local_business_to_crawlers(): void
    {
        $this->seed(ContentSeeder::class);

        $this->get('/')
            ->assertOk()
            ->assertSee('<title inertia>Sports35</title>', false)
            ->assertSee('Sports35, İzmir’in Buca ilçesinde yer alan spor salonudur.', false)
            ->assertSee('name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"', false)
            ->assertSee('"@type":["ExerciseGym","HealthClub"]', false)
            ->assertSee('"addressLocality":"Buca"', false)
            ->assertSee('"addressRegion":"İzmir"', false)
            ->assertSee('Şirinyer, Buca, İzmir', false)
            ->assertSee('38.3902341', false)
            ->assertSee('27.1484883', false)
            ->assertSee('OpeningHoursSpecification', false)
            ->assertSee(route('llms'), false);

        $this->withSession(['locale' => 'en'])
            ->get('/')
            ->assertSee('Sports35', false)
            ->assertDontSee('Gym in Buca and Şirinyer', false);
    }

    public function test_public_html_exposes_headings_social_image_and_languages(): void
    {
        $this->get('/')
            ->assertOk()
            ->assertSee('<html lang="tr"', false)
            ->assertSee('rel="canonical"', false)
            ->assertSee('name="description"', false)
            ->assertSee('property="og:image"', false)
            ->assertSee('/images/og.jpg', false)
            ->assertSee('hreflang="tr"', false)
            ->assertSee('hreflang="en"', false)
            ->assertSee('hreflang="x-default"', false)
            ->assertSee('<h1>'.__('public.hero.title').'</h1>', false);

        $this->get('/?lang=en')
            ->assertOk()
            ->assertSee('<html lang="en"', false)
            ->assertSee('lang=en', false)
            ->assertSee('<h1>'.__('public.hero.title', [], 'en').'</h1>', false);

        $this->get('/?lang=tr')->assertStatus(301);

        GalleryItem::create([
            'image_path' => 'sports35/floor.jpg',
            'is_active' => true,
        ]);

        $this->get('/galeri')
            ->assertOk()
            ->assertSee('alt="'.__('public.gallery_page.title').'"', false);

        $this->get('/cerez-ve-guvenlik')
            ->assertOk()
            ->assertSee(__('public.seo.cookies_description'), false)
            ->assertSee('<h1>'.__('public.cookie_policy.title').'</h1>', false);
    }

    public function test_admin_pages_are_not_offered_to_search_engines(): void
    {
        $this->get('/admin/login')
            ->assertOk()
            ->assertSee('noindex, nofollow', false)
            ->assertDontSee('ExerciseGym', false);
    }

    private function blogPost(string $slug, string $title, $publishedAt, bool $published = true): array
    {
        return [
            'title_tr' => $title,
            'title_en' => $title,
            'slug' => $slug,
            'content_tr' => '<p>'.$title.'</p>',
            'content_en' => '<p>'.$title.'</p>',
            'is_published' => $published,
            'published_at' => $publishedAt,
        ];
    }
}
