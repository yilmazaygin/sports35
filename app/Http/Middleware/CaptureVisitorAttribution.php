<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\ConversionEvent;
use Illuminate\Http\Request;

class CaptureVisitorAttribution
{
    public function handle(Request $request, Closure $next)
    {
        if ($request->isMethod('GET') && ! $request->session()->has('first_touch_attribution')) {
            $request->session()->put('first_touch_attribution', [
                'landing_page' => $request->getPathInfo(),
                'referrer' => $this->limit($request->headers->get('referer'), 1000),
                'utm_source' => $this->limit($request->query('utm_source'), 100),
                'utm_medium' => $this->limit($request->query('utm_medium'), 100),
                'utm_campaign' => $this->limit($request->query('utm_campaign'), 150),
                'utm_content' => $this->limit($request->query('utm_content'), 150),
                'utm_term' => $this->limit($request->query('utm_term'), 150),
                'cta_source' => $this->limit($request->query('cta_source', $request->query('cta')), 100),
            ]);
        }

        $response = $next($request);

        if ($request->isMethod('GET') && ! $request->is('admin/*') && ! $request->is('analytics/events')) {
            ConversionEvent::create([
                'event_type' => 'page_view',
                'path' => mb_substr('/'.$request->path(), 0, 500),
                ...($request->session()->get('first_touch_attribution') ?? []),
            ]);
        }

        return $response;
    }

    private function limit(mixed $value, int $length): ?string
    {
        return filled($value) ? mb_substr((string) $value, 0, $length) : null;
    }
}
