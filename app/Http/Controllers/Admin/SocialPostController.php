<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreSocialPostRequest;
use App\Http\Requests\Admin\UpdateSocialPostRequest;
use App\Models\SocialPost;
use App\Services\ImageOptimizer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class SocialPostController extends Controller
{
    public function __construct(private ImageOptimizer $imageOptimizer) {}

    public function index(): Response
    {
        return Inertia::render('Admin/SocialPosts/Index', [
            'posts' => SocialPost::query()
                ->orderBy('sort_order')
                ->get()
                ->map(fn (SocialPost $post) => [
                    'id' => $post->id,
                    'platform' => $post->platform,
                    'image_url' => $post->imageUrl(),
                    'post_url' => $post->post_url,
                    'caption_tr' => $post->caption_tr,
                    'caption_en' => $post->caption_en,
                    'sort_order' => $post->sort_order,
                    'is_active' => $post->is_active,
                ]),
        ]);
    }

    public function store(StoreSocialPostRequest $request): RedirectResponse
    {
        $data = $request->safe()->except(['image']);
        $data['image_path'] = $this->imageOptimizer->optimizeAndStore(
            $request->file('image'),
            'social/'.date('Y/m'),
        );

        SocialPost::create($data);

        return back()->with('success', __('admin.messages.created'));
    }

    public function update(UpdateSocialPostRequest $request, SocialPost $socialPost): RedirectResponse
    {
        $data = $request->safe()->except(['image']);

        if ($request->hasFile('image')) {
            Storage::disk('public')->delete($socialPost->image_path);
            $data['image_path'] = $this->imageOptimizer->optimizeAndStore(
                $request->file('image'),
                'social/'.date('Y/m'),
            );
        }

        $socialPost->update($data);

        return back()->with('success', __('admin.messages.saved'));
    }

    public function destroy(SocialPost $socialPost): RedirectResponse
    {
        Storage::disk('public')->delete($socialPost->image_path);
        $socialPost->delete();

        return back()->with('success', __('admin.messages.deleted'));
    }
}
