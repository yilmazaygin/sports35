import { useTranslation } from '@/hooks/useTranslation';

function formatPrice(amount) {
    return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
        maximumFractionDigits: 0,
    }).format(amount);
}

function PriceCell({ cash, card, campaignPercent, labels }) {
    const prices = [
        { key: 'cash', value: cash, label: labels.cash },
        ...(card !== cash ? [{ key: 'card', value: card, label: labels.card }] : []),
    ];

    return (
        <div className="grid gap-2 sm:grid-cols-2">
            {prices.map((price) => {
                const discounted = campaignPercent ? Math.round(price.value * (1 - campaignPercent / 100)) : null;

                return (
                    <div key={price.key} className="flex flex-col items-center gap-1">
                        <span className="text-xs uppercase tracking-wider text-zinc-500">{price.label}</span>
                        {discounted !== null ? <span className="text-xs text-zinc-500 line-through">{formatPrice(price.value)}</span> : null}
                        <span className={`text-xl font-black ${discounted !== null ? 'text-brand-red' : 'text-white'}`}>
                            {formatPrice(discounted !== null ? discounted : price.value)}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}

export default function PricingTable({ pricing }) {
    const { t } = useTranslation();
    const { packages, campaign, vat_included } = pricing;
    const hasCampaign = Boolean(campaign?.active);

    return (
        <section id="pricing" className="bg-brand-black py-16 md:py-24">
            <div className="mx-auto max-w-6xl px-4">
                <div className="mb-12 text-center">
                    <h2 className="mb-3 text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl">
                        {t('pricing.title')}
                    </h2>
                    <p className="text-zinc-400">{t('pricing.subtitle')}</p>
                    {hasCampaign && (
                        <div className="mt-4 inline-block rounded-full bg-brand-red px-4 py-1.5 text-sm font-bold uppercase text-white">
                            {campaign.title || t(`pricing.campaigns.${campaign.label}`)} — %{campaign.discount_percent}
                        </div>
                    )}
                </div>

                <div className="overflow-x-auto">
                    <table className="mx-auto w-full max-w-2xl border-collapse">
                        <thead>
                            <tr className="border-b border-zinc-800">
                                <th className="px-4 py-4 text-left text-sm font-medium uppercase tracking-wider text-zinc-500">
                                    {t('pricing.duration')}
                                </th>
                                <th className="px-4 py-4 text-center text-sm font-medium uppercase tracking-wider text-zinc-400">
                                    {t('pricing.price')}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {packages.map((pkg) => (
                                <tr
                                    key={pkg.months}
                                    className="border-b border-zinc-800/50 transition hover:bg-zinc-900/50"
                                >
                                    <td className="px-4 py-6">
                                        <span className="text-lg font-bold text-white">
                                            {t('pricing.months', { count: pkg.months })}
                                        </span>
                                        {vat_included && (
                                            <span className="ml-2 text-xs text-zinc-500">
                                                ({t('pricing.vat_included')})
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-6 text-center">
                                        <PriceCell cash={pkg.cash_price} card={pkg.card_price} campaignPercent={hasCampaign ? campaign.discount_percent : null} labels={{ cash: t('pricing.cash'), card: t('pricing.card') }} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}
