import CtaButton from '@/Components/Public/CtaButton';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head } from '@inertiajs/react';
import { useTranslation } from '@/hooks/useTranslation';

function formatDate(value, locale) {
    if (!value) return null;

    return new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'tr-TR', {
        dateStyle: 'medium',
    }).format(new Date(value));
}

export default function Index({ campaigns = [] }) {
    const { locale, t } = useTranslation();

    return (
        <PublicLayout>
            <Head title={t('campaigns_page.title')} />

            <section className="bg-brand-black py-12 md:py-16">
                <div className="mx-auto max-w-6xl px-4 text-center">
                    <h1 className="text-3xl font-black uppercase text-white sm:text-4xl">{t('campaigns_page.title')}</h1>
                    <p className="mt-3 text-zinc-400">{t('campaigns_page.subtitle')}</p>
                </div>
            </section>

            <section className="bg-zinc-950 py-16 md:py-20">
                <div className="mx-auto max-w-6xl px-4">
                    {campaigns.length === 0 ? (
                        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-10 text-center text-zinc-400">
                            {t('campaigns_page.empty')}
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {campaigns.map((campaign) => (
                                <article key={campaign.id} className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
                                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-red">
                                        {t('campaigns_page.badge')}
                                    </p>
                                    <h2 className="mt-3 text-2xl font-black text-white">{campaign.title}</h2>
                                    <p className="mt-4 text-4xl font-black text-brand-red">%{campaign.discount_percent}</p>
                                    <p className="mt-1 text-sm text-zinc-400">{t('campaigns_page.discount')}</p>
                                    {(campaign.starts_at || campaign.ends_at) && (
                                        <p className="mt-5 text-sm text-zinc-500">
                                            {campaign.starts_at && `${t('campaigns_page.from')} ${formatDate(campaign.starts_at, locale)}`}
                                            {campaign.starts_at && campaign.ends_at ? ' — ' : ''}
                                            {campaign.ends_at && `${t('campaigns_page.until')} ${formatDate(campaign.ends_at, locale)}`}
                                        </p>
                                    )}
                                    <CtaButton href={route('free-trial.create')} variant="primary" className="mt-6 w-full">
                                        {t('campaigns_page.cta')}
                                    </CtaButton>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
