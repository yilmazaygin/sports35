<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use App\Models\SocialPost;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    public function __invoke(): Response
    {
        $contact = SiteSetting::contact();
        $locale = app()->getLocale();

        return Inertia::render('Public/Contact/Index', [
            'contact' => [
                'phone' => $contact['phone'],
                'whatsapp' => $contact['whatsapp'],
                'email' => $contact['email'],
                'address' => $locale === 'en' ? $contact['address_en'] : $contact['address_tr'],
                'facebook' => $contact['facebook'],
                'instagram' => $contact['instagram'],
                'maps_embed' => $contact['maps_embed'],
            ],
            'socialPosts' => SocialPost::query()
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->get()
                ->map(fn (SocialPost $post) => [
                    'image_url' => $post->imageUrl(),
                    'post_url' => $post->post_url,
                    'platform' => $post->platform,
                    'caption' => $post->localizedCaption(),
                ]),
        ]);
    }
}
