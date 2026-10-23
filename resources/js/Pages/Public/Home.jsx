import HeroSection from '@/Components/Public/HeroSection';
import Calculators from '@/Components/Public/Calculators';
import PricingTable from '@/Components/Public/PricingTable';
import ServiceBlocks from '@/Components/Public/ServiceBlocks';
import FacilityShowcase from '@/Components/Public/FacilityShowcase';
import LocationPreview from '@/Components/Public/LocationPreview';
import WorkingHours from '@/Components/Public/WorkingHours';
import PublicLayout from '@/Layouts/PublicLayout';
import { useTranslation } from '@/hooks/useTranslation';
import { Head, usePage } from '@inertiajs/react';

export default function Home({ alert, workingHours, pricing, whyUs, facilities = [] }) {
    const { contact } = usePage().props;
    const { t } = useTranslation();

    return (
        <PublicLayout>
            <Head title={t('seo.home_title')} />
            <HeroSection alert={alert} />
            <ServiceBlocks whyUs={whyUs} />
            <FacilityShowcase facilities={facilities} />
            <PricingTable pricing={pricing} />
            <Calculators />
            <WorkingHours hours={workingHours} alert={alert} />
            <LocationPreview contact={contact} />
        </PublicLayout>
    );
}
