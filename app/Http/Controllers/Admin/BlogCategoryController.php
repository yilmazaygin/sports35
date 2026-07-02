<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreBlogCategoryRequest;
use App\Http\Requests\Admin\UpdateBlogCategoryRequest;
use App\Models\BlogCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class BlogCategoryController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/BlogCategories/Index', [
            'categories' => BlogCategory::query()->orderBy('sort_order')->get(),
        ]);
    }

    public function store(StoreBlogCategoryRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['slug'] = Str::slug($data['name_tr']);

        BlogCategory::create($data);

        return back()->with('success', __('admin.messages.created'));
    }

    public function update(UpdateBlogCategoryRequest $request, BlogCategory $blogCategory): RedirectResponse
    {
        $data = $request->validated();
        $data['slug'] = Str::slug($data['name_tr']);

        $blogCategory->update($data);

        return back()->with('success', __('admin.messages.saved'));
    }

    public function destroy(BlogCategory $blogCategory): RedirectResponse
    {
        $blogCategory->delete();

        return back()->with('success', __('admin.messages.deleted'));
    }
}
