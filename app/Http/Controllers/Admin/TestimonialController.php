<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use App\Services\ImageOptimizer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class TestimonialController extends Controller
{
    public function __construct(private ImageOptimizer $imageOptimizer) {}

    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim()->toString();
        $active = $request->string('active')->toString();
        return Inertia::render('Admin/Testimonials/Index', [
            'testimonials' => Testimonial::query()->when($search !== '', fn ($q) => $q->where('name', 'like', "%{$search}%"))->when(in_array($active, ['active', 'inactive'], true), fn ($q) => $q->where('is_active', $active === 'active'))->orderBy('sort_order')->paginate(20)->withQueryString()->through(fn (Testimonial $item) => [...$item->toArray(), 'photo_url' => $item->photoUrl()]),
            'search' => $search, 'active' => $active,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        Testimonial::create($this->data($request, true));
        return back()->with('success', __('admin.messages.created'));
    }

    public function update(Request $request, Testimonial $testimonial): RedirectResponse
    {
        $testimonial->update($this->data($request, false, $testimonial));
        return back()->with('success', __('admin.messages.saved'));
    }

    public function destroy(Testimonial $testimonial): RedirectResponse
    {
        if ($testimonial->photo_path) {
            Storage::disk('public')->delete($testimonial->photo_path);
        }
        $testimonial->delete();
        return back()->with('success', __('admin.messages.deleted'));
    }

    private function data(Request $request, bool $requiredPhoto, ?Testimonial $testimonial = null): array
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'quote_tr' => ['nullable', 'string', 'max:2000'], 'quote_en' => ['nullable', 'string', 'max:2000'],
            'context_tr' => ['nullable', 'string', 'max:255'], 'context_en' => ['nullable', 'string', 'max:255'],
            'photo' => [$requiredPhoto ? 'nullable' : 'nullable', 'image', 'max:10240'],
            'sort_order' => ['integer', 'min:0'], 'is_active' => ['boolean'],
        ]);
        if ($request->hasFile('photo')) {
            if ($testimonial) Storage::disk('public')->delete($testimonial->photo_path);
            $data['photo_path'] = $this->imageOptimizer->optimizeAndStore($request->file('photo'), 'testimonials/'.date('Y/m'));
        }
        unset($data['photo']);
        return $data;
    }
}
