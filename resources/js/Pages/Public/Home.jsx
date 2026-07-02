import CtaButton from '@/Components/Public/CtaButton';
import AlertBanner from '@/Components/Public/AlertBanner';
import HeroSection from '@/Components/Public/HeroSection';
import PricingTable from '@/Components/Public/PricingTable';
import ServiceBlocks from '@/Components/Public/ServiceBlocks';
import WorkingHours from '@/Components/Public/WorkingHours';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head, usePage } from '@inertiajs/react';
import { useTranslation } from '@/hooks/useTranslation';

export default function Home({ alert, workingHours, pricing, services }) {
    const { t } = useTranslation();
    const { contact } = usePage().props;
    const whatsappUrl = `https://wa.me/${contact?.whatsapp || '905000000000'}`;

    return (
        <PublicLayout>
            <Head title={t('nav.home')} />
            <AlertBanner alert={alert} />
            <HeroSection />
            <WorkingHours hours={workingHours} />
            <ServiceBlocks services={services} />
            <PricingTable pricing={pricing} />

            <section className="bg-gradient-to-r from-brand-red to-brand-red-dark py-16 md:py-20">
                <div className="mx-auto max-w-3xl px-4 text-center">
                    <h2 className="mb-4 text-2xl font-black uppercase text-white sm:text-3xl">
                        {t('cta.title')}
                    </h2>
                    <p className="mb-8 text-white/80">{t('cta.subtitle')}</p>
                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <CtaButton href={whatsappUrl} variant="secondary">
                            {t('cta.button')}
                        </CtaButton>
                        <CtaButton href={route('contact')} variant="secondary" className="!border-white/50">
                            {t('cta.contact')}
                        </CtaButton>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
