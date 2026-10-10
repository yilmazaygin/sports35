<?php

namespace App\Services;

use App\Models\Campaign;
use App\Models\Facility;
use App\Models\GroupClass;
use App\Models\MembershipPackage;
use App\Models\SpecialDay;
use App\Models\Trainer;
use App\Models\Testimonial;
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
                'cash_price' => (float) $pkg->cash_price,
                'card_price' => (float) ($pkg->card_price ?? $pkg->cash_price),
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

    public function facilities(): array
    {
        return Facility::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get()
            ->map(fn (Facility $facility) => [
                'id' => $facility->id,
                'name' => $facility->localizedName(),
                'category' => $facility->category,
                'description' => $facility->localizedDescription(),
                'image_url' => $facility->imageUrl(),
            ])
            ->all();
    }

    public function trainers(): array
    {
        return Trainer::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get()
            ->map(fn (Trainer $trainer) => [
                'id' => $trainer->id,
                'name' => $trainer->name,
                'photo_url' => $trainer->photoUrl(),
                'role' => $trainer->localizedRole(),
                'specialties' => $trainer->localizedSpecialties(),
                'bio' => $trainer->localizedBio(),
            ])
            ->all();
    }

    public function groupClasses(): array
    {
        return GroupClass::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get()
            ->map(fn (GroupClass $class) => [
                'id' => $class->id,
                'name' => $class->localizedName(),
                'description' => $class->localized('description'),
                'difficulty' => $class->localized('difficulty'),
                'schedule' => $class->localized('schedule_text'),
                'instructor' => $class->localized('instructor_name'),
            ])
            ->all();
    }

    public function testimonials(): array
    {
        return Testimonial::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get()
            ->map(fn (Testimonial $item) => [
                'id' => $item->id, 'name' => $item->name, 'quote' => $item->localized('quote'),
                'context' => $item->localized('context'), 'photo_url' => $item->photoUrl(),
            ])->filter(fn (array $item) => filled($item['quote']))->values()->all();
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
