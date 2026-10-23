<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Facility;
use App\Services\ImageOptimizer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class FacilityController extends Controller
{
    public function __construct(private ImageOptimizer $imageOptimizer) {}

    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim()->toString();
        $facilities = Facility::query()->when($search, fn ($query) => $query->where('name_tr', 'like', "%{$search}%")->orWhere('name_en', 'like', "%{$search}%"))->orderBy('sort_order')->paginate(20)->withQueryString();

        return Inertia::render('Admin/Facilities/Index', [
            'facilities' => $facilities->getCollection()->map(fn (Facility $facility) => [
                ...$facility->toArray(), 'image_url' => $facility->imageUrl(),
            ]),
            'pagination' => $facilities->toArray()['links'],
            'search' => $search,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request, true);
        $data['image_path'] = $this->imageOptimizer->optimizeAndStore($request->file('image'), 'facilities/'.date('Y/m'));
        unset($data['image']);
        Facility::create($data);

        return back()->with('success', __('admin.messages.created'));
    }

    public function update(Request $request, Facility $facility): RedirectResponse
    {
        $data = $this->validated($request, false);
        if ($request->hasFile('image')) {
            Storage::disk('public')->delete($facility->image_path);
            $data['image_path'] = $this->imageOptimizer->optimizeAndStore($request->file('image'), 'facilities/'.date('Y/m'));
        }
        unset($data['image']);
        $facility->update($data);

        return back()->with('success', __('admin.messages.saved'));
    }

    public function destroy(Facility $facility): RedirectResponse
    {
        Storage::disk('public')->delete($facility->image_path);
        $facility->delete();

        return back()->with('success', __('admin.messages.deleted'));
    }

    private function validated(Request $request, bool $requiredImage): array
    {
        return $request->validate([
            'name_tr' => ['required', 'string', 'max:255'], 'name_en' => ['required', 'string', 'max:255'],
            'category' => ['required', 'in:cardio,strength,functional,locker,other'],
            'description_tr' => ['nullable', 'string', 'max:1000'], 'description_en' => ['nullable', 'string', 'max:1000'],
            'image' => [$requiredImage ? 'required' : 'nullable', 'image', 'max:10240'],
            'sort_order' => ['integer', 'min:0'], 'is_active' => ['boolean'],
        ]);
    }
}
