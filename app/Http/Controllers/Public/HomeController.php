<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
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
            'whyUs' => SiteSetting::whyUsForLocale(),
            'facilities' => $this->content->facilities(),
        ]);
    }
}
