import CtaButton from '@/Components/Public/CtaButton';
import AlertBanner from '@/Components/Public/AlertBanner';
import HeroSection from '@/Components/Public/HeroSection';
import PricingTable from '@/Components/Public/PricingTable';
import ServiceBlocks from '@/Components/Public/ServiceBlocks';
import FacilityShowcase from '@/Components/Public/FacilityShowcase';
import TrainerGrid from '@/Components/Public/TrainerGrid';
import GroupClassList from '@/Components/Public/GroupClassList';
import TrustFoundation from '@/Components/Public/TrustFoundation';
import LocationPreview from '@/Components/Public/LocationPreview';
import TestimonialSection from '@/Components/Public/TestimonialSection';
import WorkingHours from '@/Components/Public/WorkingHours';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head, usePage } from '@inertiajs/react';
import { useTranslation } from '@/hooks/useTranslation';

export default function Home({ alert, workingHours, pricing, services, facilities = [], trainers = [], groupClasses = [], testimonials = [] }) {
    const { t } = useTranslation();
    const { contact } = usePage().props;
    const whatsappUrl = `https://wa.me/${contact?.whatsapp || '905000000000'}`;

    return (
        <PublicLayout>
            <Head title="Sports35" />
            <AlertBanner alert={alert} />
            <HeroSection />
            <section className="bg-brand-black py-14 md:py-20">
                <div className="mx-auto max-w-3xl px-4 text-center">
                    <p className="text-lg leading-relaxed text-zinc-300">{t('home_intro.text')}</p>
                </div>
            </section>
            <ServiceBlocks services={services} />
            <FacilityShowcase facilities={facilities} />
            <WorkingHours hours={workingHours} />
            <TrainerGrid trainers={trainers} />
            <GroupClassList classes={groupClasses} />
            <PricingTable pricing={pricing} />
            <TestimonialSection testimonials={testimonials} />
            <TrustFoundation />
            <LocationPreview contact={contact} hours={workingHours} />

            <section className="border-t border-brand-border bg-brand-surface py-16 md:py-20">
                <div className="mx-auto max-w-3xl px-4 text-center">
                    <h2 className="mb-4 text-2xl font-black uppercase text-white sm:text-3xl">
                        {t('cta.title')}
                    </h2>
                    <p className="mb-8 text-white/80">{t('cta.subtitle')}</p>
                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <CtaButton href={route('free-trial.create')} variant="secondary">
                            {t('cta.free_trial')}
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
