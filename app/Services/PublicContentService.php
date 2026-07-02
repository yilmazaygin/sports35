<?php

namespace App\Services;

use App\Models\Campaign;
use App\Models\MembershipPackage;
use App\Models\SpecialDay;
use App\Models\WorkingHour;
use Carbon\Carbon;

class PublicContentService
{
    public function workingHours(): array
    {
        return WorkingHour::query()
            ->orderBy('sort_order')
            ->get()
            ->map(fn (WorkingHour $hour) => [
                'day' => $hour->day_key,
                'hours' => $hour->is_closed
                    ? null
                    : substr((string) $hour->opens_at, 0, 5).' - '.substr((string) $hour->closes_at, 0, 5),
                'is_closed' => $hour->is_closed,
            ])
            ->all();
    }

    public function pricing(): array
    {
        $packages = MembershipPackage::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('duration_months')
            ->get()
            ->map(fn (MembershipPackage $pkg) => [
                'months' => $pkg->duration_months,
                'price' => (float) $pkg->cash_price,
            ])
            ->all();

        $campaign = Campaign::query()->currentlyActive()->first();

        return [
            'packages' => $packages,
            'campaign' => $campaign ? [
                'active' => true,
                'label' => $campaign->label,
                'title' => $campaign->localizedTitle(),
                'discount_percent' => $campaign->discount_percent,
            ] : null,
            'vat_included' => true,
        ];
    }

    public function todayAlert(): ?array
    {
        $specialDay = SpecialDay::query()
            ->where('is_active', true)
            ->where('show_banner', true)
            ->whereDate('date', Carbon::today())
            ->first();

        if (! $specialDay) {
            return null;
        }

        return [
            'message' => $specialDay->localizedMessage(),
            'type' => $specialDay->type,
        ];
    }
}
