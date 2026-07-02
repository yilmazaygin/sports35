import { useTranslation } from '@/hooks/useTranslation';

const icons = {
    dumbbell: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 10h2m12 0h2M6 10v4m12-4v4M8 8v8m8-8v8M10 10h4v4h-4z" />
    ),
    equipment: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 0v10" />
    ),
    group: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    ),
};

export default function ServiceBlocks({ services }) {
    const { t } = useTranslation();

    return (
        <section className="bg-zinc-950 py-16 md:py-24">
            <div className="mx-auto max-w-6xl px-4">
                <h2 className="mb-12 text-center text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl">
                    {t('services.title')}
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {services.map((service) => (
                        <div
                            key={service.key}
                            className="group rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 transition hover:border-brand-red/50 hover:bg-zinc-900"
                        >
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-red/10 text-brand-red transition group-hover:bg-brand-red group-hover:text-white">
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {icons[service.icon]}
                                </svg>
                            </div>
                            <h3 className="mb-2 text-lg font-bold text-white">
                                {t(`services.items.${service.key}.title`)}
                            </h3>
                            <p className="text-sm leading-relaxed text-zinc-400">
                                {t(`services.items.${service.key}.description`)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
