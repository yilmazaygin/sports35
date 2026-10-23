import { useEffect, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

function formatDate(value, locale) {
    if (!value) return null;

    const [year, month, day] = value.split('-').map(Number);

    return new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'tr-TR', {
        dateStyle: 'long',
    }).format(new Date(year, month - 1, day));
}

function formatPrice(amount) {
    return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
        maximumFractionDigits: 0,
    }).format(amount);
}

function variationAmount(pkg, variation) {
    return pkg.variation_prices?.[variation.id] ?? pkg.variation_prices?.[String(variation.id)];
}

function durationLabel(t, count) {
    return t(count === 1 ? 'pricing.month' : 'pricing.months', { count });
}

function GiftIcon({ className = 'h-6 w-6' }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.75}
                d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
            />
        </svg>
    );
}

export default function PricingTable({ pricing }) {
    const { locale, t } = useTranslation();
    const { packages, offers = [], variations = [] } = pricing;
    const [selected, setSelected] = useState(null);
    const hasVariations = variations.length > 0;

    if (!packages?.length && offers.length === 0) {
        return null;
    }

    useEffect(() => {
        if (!selected) return undefined;

        const onKey = (event) => {
            if (event.key === 'Escape') setSelected(null);
        };

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', onKey);

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', onKey);
        };
    }, [selected]);

    return (
        <section id="pricing" className="scroll-mt-28 border-t border-brand-red bg-brand-surface py-16 md:py-24">
            <div className="mx-auto max-w-6xl px-4">
                <div className="mb-12 text-center">
                    <h2 className="mb-3 text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl">
                        {t('pricing.title')}
                    </h2>
                    <p className="text-zinc-400">{t('pricing.subtitle')}</p>
                </div>

                {offers.length > 0 && (
                    <div className="mx-auto mb-10 flex max-w-2xl flex-col gap-3">
                        {offers.map((offer) => (
                            <button
                                key={offer.id}
                                type="button"
                                onClick={() => setSelected(offer)}
                                className="flex items-center justify-start gap-3 rounded-2xl bg-brand-orange px-4 py-3.5 text-left text-white transition hover:bg-brand-orange-dark sm:justify-center sm:px-5 sm:py-4 sm:text-center"
                            >
                                <GiftIcon className="h-6 w-6 shrink-0" />
                                <span className="text-[15px] font-bold leading-snug sm:text-lg">{offer.title}</span>
                            </button>
                        ))}
                    </div>
                )}

                <div className="mx-auto w-full max-w-xl md:hidden">
                    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/40">
                        {packages.map((pkg) => (
                            <article key={pkg.months} className="border-b border-zinc-800 px-5 py-5 last:border-b-0">
                                <h3 className="text-center text-base font-bold text-white">{durationLabel(t, pkg.months)}</h3>
                                <dl className="mt-3 space-y-2.5">
                                    <div className="flex items-baseline justify-between gap-4">
                                        <dt className="text-sm text-zinc-400">{hasVariations ? t('pricing.normal_price') : t('pricing.price')}</dt>
                                        <dd className="shrink-0 text-lg font-black tabular-nums text-white">{formatPrice(pkg.price)}</dd>
                                    </div>
                                    {variations.map((variation) => {
                                        const amount = variationAmount(pkg, variation);

                                        return (
                                            <div key={variation.id} className="flex items-baseline justify-between gap-4">
                                                <dt className="min-w-0 text-sm text-zinc-400">{variation.name}</dt>
                                                <dd className={`shrink-0 text-lg font-black tabular-nums ${amount == null ? 'text-zinc-600' : 'text-white'}`}>
                                                    {amount == null ? '—' : formatPrice(amount)}
                                                </dd>
                                            </div>
                                        );
                                    })}
                                </dl>
                            </article>
                        ))}
                    </div>
                </div>

                <div className={`mx-auto hidden w-full md:block ${hasVariations ? 'max-w-4xl' : 'max-w-xl'}`}>
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-zinc-800">
                                <th className="py-4 pr-4 text-left text-sm font-medium uppercase tracking-wider text-zinc-400">
                                    {t('pricing.duration')}
                                </th>
                                <th className="px-4 py-4 text-right text-sm font-medium uppercase tracking-wider text-zinc-400">
                                    {hasVariations ? t('pricing.normal_price') : t('pricing.price')}
                                </th>
                                {variations.map((variation) => (
                                    <th
                                        key={variation.id}
                                        className="px-4 py-4 text-right text-sm font-medium text-zinc-400"
                                    >
                                        {variation.name}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {packages.map((pkg) => (
                                <tr
                                    key={pkg.months}
                                    className="group border-b border-zinc-800/50 transition hover:bg-zinc-900/50"
                                >
                                    <td className="py-6 pr-4 text-left">
                                        <span className="text-lg font-bold text-white">
                                            {durationLabel(t, pkg.months)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-6 text-right">
                                        <span className="text-xl font-black tabular-nums text-white transition-colors group-hover:text-brand-orange">{formatPrice(pkg.price)}</span>
                                    </td>
                                    {variations.map((variation) => {
                                        const amount = variationAmount(pkg, variation);

                                        return (
                                            <td key={variation.id} className="px-4 py-6 text-right">
                                                {amount == null ? (
                                                    <span className="text-xl font-black text-zinc-600">—</span>
                                                ) : (
                                                    <span className="text-xl font-black tabular-nums text-white transition-colors group-hover:text-brand-orange">{formatPrice(amount)}</span>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {selected && (
                <div
                    className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
                    onClick={() => setSelected(null)}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="campaign-dialog-title"
                        className="flex max-h-[min(44rem,calc(100dvh-2rem))] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900 shadow-2xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="flex items-start gap-3 border-b border-zinc-800 px-4 py-4 sm:gap-4 sm:px-8 sm:py-5">
                            {selected.icon_url ? (
                                <img src={selected.icon_url} alt="" className="h-12 w-12 shrink-0 rounded-xl object-cover" />
                            ) : (
                                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-orange/15 text-brand-orange">
                                    <GiftIcon className="h-6 w-6" />
                                </span>
                            )}
                            <h3 id="campaign-dialog-title" className="min-w-0 flex-1 pt-1.5 text-xl font-bold leading-snug text-white sm:pt-2 sm:text-2xl">
                                {selected.title}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setSelected(null)}
                                aria-label={t('campaigns_page.close')}
                                className="-mr-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-zinc-400 transition hover:bg-white/10 hover:text-white"
                            >
                                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M6 6l12 12M18 6 6 18" />
                                </svg>
                            </button>
                        </div>
                        <div className="overflow-y-auto px-4 py-4 sm:px-8 sm:py-6">
                            <p className="whitespace-pre-wrap text-base leading-7 text-zinc-200 sm:text-lg sm:leading-8">{selected.body}</p>
                        </div>
                        <div className="grid grid-cols-1 border-t border-zinc-800 sm:grid-cols-2">
                            <div className="px-4 py-4 sm:px-8 sm:py-5">
                                <p className="text-sm font-semibold uppercase tracking-wide text-zinc-400">{t('campaigns_page.from')}</p>
                                <p className="mt-1 text-base font-medium text-white sm:text-lg">{formatDate(selected.starts_on, locale)}</p>
                            </div>
                            <div className="border-t border-zinc-800 px-4 py-4 sm:border-l sm:border-t-0 sm:px-8 sm:py-5">
                                <p className="text-sm font-semibold uppercase tracking-wide text-zinc-400">{t('campaigns_page.until')}</p>
                                <p className="mt-1 text-base font-medium text-white sm:text-lg">{formatDate(selected.ends_on, locale)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
