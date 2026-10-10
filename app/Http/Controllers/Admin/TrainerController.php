<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Trainer;
use App\Services\ImageOptimizer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class TrainerController extends Controller
{
    public function __construct(private ImageOptimizer $imageOptimizer) {}

    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim()->toString();
        $trainers = Trainer::query()->when($search, fn ($query) => $query->where('name', 'like', "%{$search}%"))->orderBy('sort_order')->paginate(20)->withQueryString();
        return Inertia::render('Admin/Trainers/Index', [
            'trainers' => $trainers->getCollection()->map(fn (Trainer $trainer) => [
                ...$trainer->toArray(),
                'photo_url' => $trainer->photoUrl(),
            ]),
            'pagination' => $trainers->toArray()['links'],
            'search' => $search,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request, true);
        $data['photo_path'] = $request->hasFile('photo')
            ? $this->imageOptimizer->optimizeAndStore($request->file('photo'), 'trainers/'.date('Y/m'))
            : null;
        unset($data['photo']);
        Trainer::create($data);

        return back()->with('success', __('admin.messages.created'));
    }

    public function update(Request $request, Trainer $trainer): RedirectResponse
    {
        $data = $this->validated($request, false);
        if ($request->hasFile('photo')) {
            Storage::disk('public')->delete($trainer->photo_path);
            $data['photo_path'] = $this->imageOptimizer->optimizeAndStore($request->file('photo'), 'trainers/'.date('Y/m'));
        }
        unset($data['photo']);
        $trainer->update($data);

        return back()->with('success', __('admin.messages.saved'));
    }

    public function destroy(Trainer $trainer): RedirectResponse
    {
        Storage::disk('public')->delete($trainer->photo_path);
        $trainer->delete();

        return back()->with('success', __('admin.messages.deleted'));
    }

    private function validated(Request $request, bool $requiredPhoto): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'photo' => [$requiredPhoto ? 'required' : 'nullable', 'image', 'max:10240'],
            'role_tr' => ['nullable', 'string', 'max:255'], 'role_en' => ['nullable', 'string', 'max:255'],
            'specialties_tr' => ['nullable', 'string', 'max:255'], 'specialties_en' => ['nullable', 'string', 'max:255'],
            'bio_tr' => ['nullable', 'string', 'max:1000'], 'bio_en' => ['nullable', 'string', 'max:1000'],
            'sort_order' => ['integer', 'min:0'], 'is_active' => ['boolean'],
        ]);
    }
}
