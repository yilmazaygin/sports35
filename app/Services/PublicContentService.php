<?php

namespace App\Services;

use App\Models\Campaign;
use App\Models\Facility;
use App\Models\MembershipPackage;
use App\Models\MembershipPriceVariation;
use App\Models\SpecialDay;
use App\Models\WorkingHour;

class PublicContentService
{
    public function workingHours(): array
    {
        return [
            'layout' => WorkingHour::layout(),
            'days' => WorkingHour::query()
                ->orderBy('sort_order')
                ->get()
                ->map(fn (WorkingHour $hour) => [
                    'day' => $hour->day_key,
                    'hours' => $hour->is_closed
                        ? null
                        : substr((string) $hour->opens_at, 0, 5).' - '.substr((string) $hour->closes_at, 0, 5),
                    'is_closed' => $hour->is_closed,
                ])
                ->all(),
        ];
    }

    public function pricing(): array
    {
        $variations = MembershipPriceVariation::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();

        $packages = MembershipPackage::query()
            ->with('variationPrices')
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('duration_months')
            ->get()
            ->map(function (MembershipPackage $pkg) use ($variations) {
                $prices = [];

                foreach ($variations as $variation) {
                    $row = $pkg->variationPrices->firstWhere('membership_price_variation_id', $variation->id);
                    $prices[(string) $variation->id] = $row ? (float) $row->price : null;
                }

                return [
                    'months' => $pkg->duration_months,
                    'price' => (float) $pkg->price,
                    'variation_prices' => $prices,
                ];
            })
            ->all();

        Campaign::deactivateExpired();

        $offers = Campaign::query()
            ->currentlyActive()
            ->orderBy('starts_on')
            ->orderBy('id')
            ->get()
            ->map(fn (Campaign $item) => [
                'id' => $item->id,
                'title' => $item->localizedTitle(),
                'body' => $item->localizedBody(),
                'icon_url' => $item->iconUrl(),
                'starts_on' => $item->starts_on->toDateString(),
                'ends_on' => $item->ends_on->toDateString(),
            ])
            ->all();

        return [
            'packages' => $packages,
            'variations' => $variations->map(fn (MembershipPriceVariation $variation) => [
                'id' => $variation->id,
                'name' => $variation->localizedName(),
            ])->values()->all(),
            'offers' => $offers,
            'vat_included' => true,
        ];
    }

    public function facilities(): array
    {
        return Facility::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get()
            ->map(fn (Facility $facility) => [
                'id' => $facility->id,
                'name' => $facility->localizedName(),
                'description' => $facility->localizedDescription(),
                'image_url' => $facility->imageUrl(),
            ])
            ->all();
    }

    public function todayAlert(): ?array
    {
        $specialDay = SpecialDay::query()
            ->where('is_active', true)
            ->where('show_banner', true)
            ->covering(SpecialDay::today())
            ->orderBy('starts_on')
            ->first();

        if (! $specialDay) {
            return null;
        }

        return [
            'message' => $specialDay->localizedMessage(),
        ];
    }
}
