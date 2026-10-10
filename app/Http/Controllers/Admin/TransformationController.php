<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTransformationRequest;
use App\Http\Requests\Admin\UpdateTransformationRequest;
use App\Models\Transformation;
use App\Services\ImageOptimizer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class TransformationController extends Controller
{
    public function __construct(private ImageOptimizer $imageOptimizer) {}

    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim()->toString();
        $items = Transformation::query()->when($search, fn ($query) => $query->where('name', 'like', "%{$search}%"))->orderBy('sort_order')->paginate(20)->withQueryString();
        return Inertia::render('Admin/Transformations/Index', [
            'items' => $items->getCollection()->map(fn ($t) => [
                'id' => $t->id,
                'name' => $t->name,
                'before_url' => $t->beforeImageUrl(),
                'after_url' => $t->afterImageUrl(),
                'description_tr' => $t->description_tr,
                'description_en' => $t->description_en,
                'duration_label_tr' => $t->duration_label_tr,
                'duration_label_en' => $t->duration_label_en,
                'sort_order' => $t->sort_order,
                'is_active' => $t->is_active,
            ]),
            'pagination' => $items->toArray()['links'],
            'search' => $search,
        ]);
    }

    public function store(StoreTransformationRequest $request): RedirectResponse
    {
        $data = $request->safe()->except(['before_image', 'after_image']);
        $data['before_image'] = $this->imageOptimizer->optimizeAndStore(
            $request->file('before_image'),
            'transformations/'.date('Y/m'),
        );
        $data['after_image'] = $this->imageOptimizer->optimizeAndStore(
            $request->file('after_image'),
            'transformations/'.date('Y/m'),
        );
        Transformation::create($data);

        return back()->with('success', __('admin.messages.created'));
    }

    public function update(UpdateTransformationRequest $request, Transformation $transformation): RedirectResponse
    {
        $data = $request->safe()->except(['before_image', 'after_image']);

        if ($request->hasFile('before_image')) {
            Storage::disk('public')->delete($transformation->before_image);
            $data['before_image'] = $this->imageOptimizer->optimizeAndStore(
                $request->file('before_image'),
                'transformations/'.date('Y/m'),
            );
        }

        if ($request->hasFile('after_image')) {
            Storage::disk('public')->delete($transformation->after_image);
            $data['after_image'] = $this->imageOptimizer->optimizeAndStore(
                $request->file('after_image'),
                'transformations/'.date('Y/m'),
            );
        }

        $transformation->update($data);

        return back()->with('success', __('admin.messages.saved'));
    }

    public function destroy(Transformation $transformation): RedirectResponse
    {
        Storage::disk('public')->delete([$transformation->before_image, $transformation->after_image]);
        $transformation->delete();

        return back()->with('success', __('admin.messages.deleted'));
    }
}
