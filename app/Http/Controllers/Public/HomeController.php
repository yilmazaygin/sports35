<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Services\PublicContentService;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __construct(private PublicContentService $content) {}

    public function __invoke(): Response
    {
        return Inertia::render('Public/Home', [
            'alert' => $this->content->todayAlert(),
            'workingHours' => $this->content->workingHours(),
            'pricing' => $this->content->pricing(),
            'services' => $this->services(),
        ]);
    }

    private function services(): array
    {
        return [
            ['key' => 'trainer_support', 'icon' => 'dumbbell'],
            ['key' => 'modern_equipment', 'icon' => 'equipment'],
            ['key' => 'group_classes', 'icon' => 'group'],
        ];
    }
}
