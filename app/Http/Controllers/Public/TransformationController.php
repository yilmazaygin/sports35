<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Transformation;
use Inertia\Inertia;
use Inertia\Response;

class TransformationController extends Controller
{
    public function __invoke(): Response
    {
        $items = Transformation::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get()
            ->map(fn (Transformation $t) => [
                'id' => $t->id,
                'name' => $t->name,
                'before_url' => $t->beforeImageUrl(),
                'after_url' => $t->afterImageUrl(),
                'description' => $t->localizedDescription(),
                'duration' => $t->localizedDuration(),
            ]);

        return Inertia::render('Public/Transformations/Index', [
            'items' => $items,
        ]);
    }
}
