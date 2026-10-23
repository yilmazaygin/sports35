<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class CookiePolicyController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('Public/Cookies/Show');
    }
}
