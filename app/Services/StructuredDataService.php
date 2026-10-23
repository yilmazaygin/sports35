<?php

namespace App\Services;

use App\Models\Facility;
use App\Models\MembershipPackage;
use App\Models\SiteSetting;
use App\Models\WorkingHour;

class StructuredDataService
{
    public function localBusiness(): array
    {
        $place = SiteSetting::place();
        $locale = app()->getLocale();
        $siteUrl = PublicSeo::siteUrl();
        $id = $siteUrl.'/#sports35';

        $gym = $this->present([
            '@type' => ['ExerciseGym', 'HealthClub'],
            '@id' => $id,
            'name' => $place['name'],
            'alternateName' => [$place['short_name'], 'Sports35 Fitness'],
            'description' => __('public.seo.default_description'),
            'url' => $siteUrl,
            'image' => $this->images() ?: null,
            'telephone' => $place['phone'] ?: null,
            'email' => $place['email'],
            'currenciesAccepted' => 'TRY',
            'priceRange' => $this->priceRange(),
            'address' => [
                '@type' => 'PostalAddress',
                'streetAddress' => $place['street'],
                'postalCode' => $place['postal_code'],
                'addressLocality' => $place['locality'],
                'addressRegion' => $place['region'],
                'addressCountry' => 'TR',
            ],
            'geo' => [
                '@type' => 'GeoCoordinates',
                'latitude' => $place['latitude'],
                'longitude' => $place['longitude'],
            ],
            'hasMap' => $place['maps_url'] ?: null,
            'areaServed' => [
                ['@type' => 'AdministrativeArea', 'name' => 'Buca, İzmir'],
                ['@type' => 'Place', 'name' => 'Şirinyer, Buca, İzmir'],
                ['@type' => 'City', 'name' => 'İzmir'],
            ],
            'openingHoursSpecification' => $this->openingHours() ?: null,
            'contactPoint' => $place['phone'] === '' ? null : [
                '@type' => 'ContactPoint',
                'telephone' => $place['phone'],
                'contactType' => 'customer service',
                'areaServed' => 'TR',
                'availableLanguage' => ['Turkish', 'English'],
            ],
            'knowsLanguage' => ['tr', 'en'],
            'sameAs' => $place['same_as'] ?: null,
            'makesOffer' => $this->offers($locale, $siteUrl) ?: null,
        ]);

        return [
            '@context' => 'https://schema.org',
            '@graph' => [
                $gym,
                $this->present([
                    '@type' => 'WebSite',
                    '@id' => $siteUrl.'/#website',
                    'name' => 'Sports35',
                    'url' => $siteUrl,
                    'description' => __('public.seo.default_description'),
                    'inLanguage' => [$locale === 'en' ? 'en' : 'tr', $locale === 'en' ? 'tr' : 'en'],
                    'publisher' => ['@id' => $id],
                ]),
            ],
        ];
    }

    private function offers(string $locale, string $siteUrl): array
    {
        return MembershipPackage::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('duration_months')
            ->get()
            ->map(fn (MembershipPackage $package) => [
                '@type' => 'Offer',
                'name' => $package->duration_months.' '.($locale === 'en' ? ($package->duration_months === 1 ? 'Month' : 'Months') : 'Ay'),
                'price' => number_format((float) $package->price, 2, '.', ''),
                'priceCurrency' => 'TRY',
                'url' => $siteUrl.'/#pricing',
                'description' => $locale === 'en'
                    ? 'Informational membership price. Memberships are not sold on this website.'
                    : 'Bilgilendirme amaçlı üyelik fiyatı. Üyelik bu siteden satılmaz.',
                'areaServed' => 'Buca, İzmir',
            ])
            ->values()
            ->all();
    }

    private function priceRange(): ?string
    {
        $prices = MembershipPackage::query()
            ->where('is_active', true)
            ->pluck('price')
            ->map(fn ($price) => (float) $price)
            ->filter(fn (float $price) => $price > 0);

        if ($prices->isEmpty()) {
            return null;
        }

        $min = $this->lira((float) $prices->min());
        $max = $this->lira((float) $prices->max());

        return $min === $max ? $min : $min.'–'.$max;
    }

    private function openingHours(): array
    {
        $days = [
            'monday' => 'Monday',
            'tuesday' => 'Tuesday',
            'wednesday' => 'Wednesday',
            'thursday' => 'Thursday',
            'friday' => 'Friday',
            'saturday' => 'Saturday',
            'sunday' => 'Sunday',
        ];

        $specs = [];

        foreach (WorkingHour::query()->orderBy('sort_order')->get() as $hour) {
            $day = $days[$hour->day_key] ?? null;

            if ($day === null || $hour->is_closed) {
                continue;
            }

            $specs[] = [
                '@type' => 'OpeningHoursSpecification',
                'dayOfWeek' => 'https://schema.org/'.$day,
                'opens' => substr((string) $hour->opens_at, 0, 5),
                'closes' => substr((string) $hour->closes_at, 0, 5),
            ];
        }

        return $specs;
    }

    private function images(): array
    {
        return Facility::query()
            ->where('is_active', true)
            ->whereNotNull('image_path')
            ->where('image_path', '!=', '')
            ->orderBy('sort_order')
            ->limit(3)
            ->get()
            ->map(fn (Facility $facility) => $facility->imageUrl())
            ->filter()
            ->map(fn (string $url) => PublicSeo::absoluteUrl($url))
            ->values()
            ->all();
    }

    private function lira(float $amount): string
    {
        return '₺'.number_format($amount, 0, ',', '.');
    }

    private function present(array $data): array
    {
        return array_filter(
            $data,
            fn ($value) => $value !== null && $value !== '' && $value !== [],
        );
    }
}
