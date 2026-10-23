import { useTranslation } from '@/hooks/useTranslation';
import WhyUsIcon from '@/Components/Public/WhyUsIcon';

export default function ServiceBlocks({ whyUs }) {
    const { t } = useTranslation();

    if (!whyUs?.items?.length) {
        return null;
    }

    return (
        <section id="why-us" className="scroll-mt-28 border-t border-brand-red bg-brand-surface py-16 md:py-24">
            <div className="mx-auto max-w-6xl px-4">
                <div className="mb-12 text-center">
                    <h2 className="text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl">
                        {t('services.title')}
                    </h2>
                    <p className="mt-3 text-zinc-400">{t('services.subtitle')}</p>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {whyUs.items.map((item) => (
                        <div
                            key={`${item.icon}-${item.title}`}
                            className="group rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 text-center transition duration-300 hover:border-brand-red/70 hover:bg-zinc-900"
                        >
                            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-brand-red/10 text-brand-red transition duration-300 group-hover:bg-brand-red group-hover:text-white">
                                <WhyUsIcon name={item.icon} className="h-7 w-7" />
                            </div>
                            <h3 className="mb-2 text-lg font-bold text-white">{item.title}</h3>
                            <p className="text-sm leading-relaxed text-zinc-400">{item.body}</p>
                        </div>
                    ))}
                </div>
                {whyUs.paragraph && (
                    <p className="mx-auto mt-12 max-w-4xl text-center text-base leading-8 text-zinc-300 sm:text-lg">
                        {whyUs.paragraph}
                    </p>
                )}
            </div>
        </section>
    );
}
