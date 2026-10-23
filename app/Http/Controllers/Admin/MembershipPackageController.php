<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreMembershipPackageRequest;
use App\Http\Requests\Admin\StoreMembershipPriceVariationRequest;
use App\Http\Requests\Admin\UpdateMembershipPackageRequest;
use App\Http\Requests\Admin\UpdateMembershipPriceVariationRequest;
use App\Models\MembershipPackage;
use App\Models\MembershipPackageVariationPrice;
use App\Models\MembershipPriceVariation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class MembershipPackageController extends Controller
{
    public function index(): Response
    {
        $variations = MembershipPriceVariation::query()
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();

        return Inertia::render('Admin/MembershipPackages/Index', [
            'variations' => $variations->map(fn (MembershipPriceVariation $variation) => [
                'id' => $variation->id,
                'name_tr' => $variation->name_tr,
                'name_en' => $variation->name_en,
                'is_active' => $variation->is_active,
            ])->values(),
            'packages' => MembershipPackage::query()
                ->with('variationPrices')
                ->orderBy('sort_order')
                ->orderBy('duration_months')
                ->get()
                ->map(fn (MembershipPackage $package) => $this->packagePayload($package, $variations))
                ->values(),
        ]);
    }

    public function store(StoreMembershipPackageRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $prices = $data['variation_prices'] ?? [];
        unset($data['variation_prices']);

        $package = MembershipPackage::create($data);
        $this->syncVariationPrices($package, $prices);

        return back()->with('success', __('admin.messages.created'));
    }

    public function update(UpdateMembershipPackageRequest $request, MembershipPackage $membershipPackage): RedirectResponse
    {
        $data = $request->validated();
        $prices = $data['variation_prices'] ?? null;
        unset($data['variation_prices']);

        $membershipPackage->update($data);

        if (is_array($prices)) {
            $this->syncVariationPrices($membershipPackage, $prices);
        }

        return back()->with('success', __('admin.messages.saved'));
    }

    public function destroy(MembershipPackage $membershipPackage): RedirectResponse
    {
        $membershipPackage->delete();

        return back()->with('success', __('admin.messages.deleted'));
    }

    public function storeVariation(StoreMembershipPriceVariationRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $prices = $data['package_prices'] ?? [];
        unset($data['package_prices']);

        $variation = MembershipPriceVariation::create([
            ...$data,
            'sort_order' => (int) MembershipPriceVariation::query()->max('sort_order') + 1,
        ]);

        $this->syncPricesForNewVariation($variation, $prices);

        return back()->with('success', __('admin.messages.created'));
    }

    public function updateVariation(UpdateMembershipPriceVariationRequest $request, MembershipPriceVariation $variation): RedirectResponse
    {
        $variation->update($request->validated());

        return back()->with('success', __('admin.messages.saved'));
    }

    public function updateVariationActive(Request $request, MembershipPriceVariation $variation): RedirectResponse
    {
        $data = $request->validate([
            'is_active' => ['required', 'boolean'],
        ]);

        $variation->update($data);

        return back()->with('success', __('admin.messages.saved'));
    }

    public function moveVariation(Request $request, MembershipPriceVariation $variation): RedirectResponse
    {
        $direction = $request->validate([
            'direction' => ['required', 'in:up,down'],
        ])['direction'];

        DB::transaction(function () use ($variation, $direction) {
            $ordered = MembershipPriceVariation::query()
                ->orderBy('sort_order')
                ->orderBy('id')
                ->get()
                ->values();

            $index = $ordered->search(fn (MembershipPriceVariation $item) => $item->id === $variation->id);
            $target = $direction === 'up' ? $index - 1 : $index + 1;

            if ($index === false || $target < 0 || $target >= $ordered->count()) {
                return;
            }

            $swap = $ordered[$target];
            $ordered[$target] = $ordered[$index];
            $ordered[$index] = $swap;

            foreach ($ordered as $position => $item) {
                $item->update(['sort_order' => $position + 1]);
            }
        });

        return back()->with('success', __('admin.messages.saved'));
    }

    public function destroyVariation(MembershipPriceVariation $variation): RedirectResponse
    {
        $variation->delete();

        return back()->with('success', __('admin.messages.deleted'));
    }

    private function packagePayload(MembershipPackage $package, Collection $variations): array
    {
        $prices = [];

        foreach ($variations as $variation) {
            $row = $package->variationPrices->firstWhere('membership_price_variation_id', $variation->id);
            $prices[(string) $variation->id] = $row ? (float) $row->price : null;
        }

        return [
            'id' => $package->id,
            'duration_months' => $package->duration_months,
            'price' => (float) $package->price,
            'is_active' => $package->is_active,
            'sort_order' => $package->sort_order,
            'variation_prices' => $prices,
        ];
    }

    private function syncVariationPrices(MembershipPackage $package, array $prices): void
    {
        $variationIds = MembershipPriceVariation::query()->pluck('id')->all();

        foreach ($prices as $variationId => $price) {
            if (! in_array((int) $variationId, $variationIds, true)) {
                continue;
            }

            if ($price === null || $price === '') {
                MembershipPackageVariationPrice::query()
                    ->where('membership_package_id', $package->id)
                    ->where('membership_price_variation_id', $variationId)
                    ->delete();

                continue;
            }

            MembershipPackageVariationPrice::query()->updateOrCreate(
                [
                    'membership_package_id' => $package->id,
                    'membership_price_variation_id' => $variationId,
                ],
                ['price' => $price],
            );
        }
    }

    private function syncPricesForNewVariation(MembershipPriceVariation $variation, array $prices): void
    {
        $packageIds = MembershipPackage::query()->pluck('id')->all();

        foreach ($prices as $packageId => $price) {
            if ($price === null || $price === '' || ! in_array((int) $packageId, $packageIds, true)) {
                continue;
            }

            MembershipPackageVariationPrice::query()->create([
                'membership_package_id' => $packageId,
                'membership_price_variation_id' => $variation->id,
                'price' => $price,
            ]);
        }
    }
}
