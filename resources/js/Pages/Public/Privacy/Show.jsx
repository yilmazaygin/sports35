import PublicLayout from '@/Layouts/PublicLayout';
import { Head } from '@inertiajs/react';
import { useTranslation } from '@/hooks/useTranslation';

const sections = ['controller', 'data', 'purposes', 'legal', 'transfers', 'retention', 'rights'];

export default function Show() {
    const { t } = useTranslation();

    return (
        <PublicLayout>
            <Head title={t('seo.privacy_title')} />

            <article className="bg-brand-black py-16 md:py-24">
                <div className="mx-auto max-w-3xl px-4">
                    <h1 className="text-3xl font-black text-white sm:text-4xl">{t('privacy.title')}</h1>
                    <p className="mt-6 text-base leading-relaxed text-zinc-300">{t('privacy.intro')}</p>

                    {sections.map((section) => (
                        <section key={section}>
                            <h2 className="mt-10 text-lg font-semibold text-white">{t(`privacy.${section}_title`)}</h2>
                            <p className="mt-3 text-base leading-relaxed text-zinc-300">{t(`privacy.${section}`)}</p>
                        </section>
                    ))}
                </div>
            </article>
        </PublicLayout>
    );
}
