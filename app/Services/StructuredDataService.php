<?php

namespace App\Services;

use App\Models\MembershipPackage;
use App\Models\SiteSetting;

class StructuredDataService
{
    public function localBusiness(): array
    {
        $contact = SiteSetting::contact();
        $locale = app()->getLocale();
        $packages = MembershipPackage::query()
            ->where('is_active', true)
            ->orderBy('duration_months')
            ->get();

        $offers = $packages->map(fn ($pkg) => [
            '@type' => 'Offer',
            'name' => $pkg->duration_months.' '.($locale === 'en' ? 'Months' : 'Ay'),
            'price' => (float) $pkg->cash_price,
            'priceCurrency' => 'TRY',
        ])->values()->all();

        return array_filter([
            '@context' => 'https://schema.org',
            '@type' => 'HealthClub',
            'name' => config('app.name'),
            'url' => config('app.url'),
            'telephone' => $contact['phone'],
            'email' => $contact['email'],
            'address' => [
                '@type' => 'PostalAddress',
                'addressLocality' => $locale === 'en' ? $contact['address_en'] : $contact['address_tr'],
                'addressCountry' => 'TR',
            ],
            'sameAs' => array_values(array_filter([
                $contact['facebook'] ?: null,
                $contact['instagram'] ?: null,
            ])),
            'makesOffer' => $offers ?: null,
        ]);
    }
}
