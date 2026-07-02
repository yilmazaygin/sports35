import PublicLayout from '@/Layouts/PublicLayout';
import ServiceBlocks from '@/Components/Public/ServiceBlocks';
import { Head } from '@inertiajs/react';
import { useTranslation } from '@/hooks/useTranslation';

const programs = ['beginner', 'strength', 'cardio'];

export default function Index() {
    const { t } = useTranslation();

    const services = [
        { key: 'trainer_support', icon: 'dumbbell' },
        { key: 'modern_equipment', icon: 'equipment' },
        { key: 'group_classes', icon: 'group' },
    ];

    return (
        <PublicLayout>
            <Head title={t('services_page.title')} />

            <section className="bg-brand-black py-12 md:py-16">
                <div className="mx-auto max-w-6xl px-4">
                    <div className="mb-12 text-center">
                        <h1 className="text-3xl font-black uppercase text-white sm:text-4xl">{t('services_page.title')}</h1>
                        <p className="mt-3 text-zinc-400">{t('services_page.subtitle')}</p>
                    </div>
                </div>
            </section>

            <ServiceBlocks services={services} />

            <section className="bg-brand-black py-16">
                <div className="mx-auto max-w-6xl px-4">
                    <h2 className="mb-8 text-center text-2xl font-bold uppercase text-white">
                        {t('services_page.programs_title')}
                    </h2>
                    <div className="grid gap-6 md:grid-cols-3">
                        {programs.map((key) => (
                            <div key={key} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                                <h3 className="text-lg font-bold text-brand-red">
                                    {t(`services_page.programs.${key}.title`)}
                                </h3>
                                <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                                    {t(`services_page.programs.${key}.description`)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
