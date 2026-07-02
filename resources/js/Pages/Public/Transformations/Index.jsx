import BeforeAfterSlider from '@/Components/Public/BeforeAfterSlider';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head } from '@inertiajs/react';
import { useTranslation } from '@/hooks/useTranslation';

export default function Index({ items }) {
    const { t } = useTranslation();

    return (
        <PublicLayout>
            <Head title={t('transformations_page.title')} />

            <section className="bg-brand-black py-12 md:py-16">
                <div className="mx-auto max-w-6xl px-4">
                    <div className="mb-12 text-center">
                        <h1 className="text-3xl font-black uppercase text-white sm:text-4xl">
                            {t('transformations_page.title')}
                        </h1>
                        <p className="mt-3 text-zinc-400">{t('transformations_page.subtitle')}</p>
                    </div>

                    {items.length === 0 ? (
                        <p className="text-center text-zinc-500">{t('transformations_page.empty')}</p>
                    ) : (
                        <div className="space-y-12">
                            {items.map((item) => (
                                <BeforeAfterSlider key={item.id} item={item} />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
