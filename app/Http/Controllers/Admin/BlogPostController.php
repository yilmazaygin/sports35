<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreBlogPostRequest;
use App\Http\Requests\Admin\UpdateBlogPostRequest;
use App\Models\BlogCategory;
use App\Models\BlogPost;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;

class BlogPostController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim()->toString();
        $status = $request->string('status')->toString();
        return Inertia::render('Admin/BlogPosts/Index', [
            'posts' => BlogPost::query()
                ->with('category:id,name_tr,name_en')
                ->when($search !== '', fn ($q) => $q->where(function ($query) use ($search) { $query->where('title_tr', 'like', "%{$search}%")->orWhere('title_en', 'like', "%{$search}%"); }))
                ->when(in_array($status, ['published', 'draft'], true), fn ($q) => $q->where('is_published', $status === 'published'))
                ->latest()->paginate(20)->withQueryString(),
            'search' => $search, 'status' => $status,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/BlogPosts/Form', [
            'post' => null,
            'categories' => BlogCategory::query()->orderBy('sort_order')->get(),
        ]);
    }

    public function store(StoreBlogPostRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['slug'] = Str::slug($data['title_tr']);

        BlogPost::create($data);

        return redirect()->route('blog-posts.index')->with('success', __('admin.messages.created'));
    }

    public function edit(BlogPost $blogPost): Response
    {
        return Inertia::render('Admin/BlogPosts/Form', [
            'post' => $blogPost,
            'categories' => BlogCategory::query()->orderBy('sort_order')->get(),
        ]);
    }

    public function update(UpdateBlogPostRequest $request, BlogPost $blogPost): RedirectResponse
    {
        $data = $request->validated();
        $data['slug'] = Str::slug($data['title_tr']);

        $blogPost->update($data);

        return back()->with('success', __('admin.messages.saved'));
    }

    public function destroy(BlogPost $blogPost): RedirectResponse
    {
        $blogPost->delete();

        return back()->with('success', __('admin.messages.deleted'));
    }
}
