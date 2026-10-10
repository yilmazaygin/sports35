import { usePage } from '@inertiajs/react';
import { useTranslation } from '@/hooks/useTranslation';
import CtaButton from '@/Components/Public/CtaButton';
import exteriorImage from '@/../images/sports35/exterior.png';

export default function LocationPreview({ contact, hours }) {
    const { t } = useTranslation();
    const { locale } = usePage().props;
    const address = locale === 'en' ? contact.address_en : contact.address_tr;

    return (
        <section className="bg-zinc-950 py-16 md:py-24">
            <div className="mx-auto grid max-w-6xl gap-8 px-4 lg:grid-cols-2">
                <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-red">{t('location_section.eyebrow')}</p>
                    <h2 className="text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl">{t('location_section.title')}</h2>
                    <p className="mt-4 text-lg text-white">{address}</p>
                    <div className="mt-6 space-y-2 text-sm text-zinc-400">
                        <p>{contact.phone}</p>
                        <p>{contact.email}</p>
                        {hours.slice(0, 3).map((item) => <p key={item.day}>{t(`hours.days.${item.day}`)}: {item.is_closed ? t('hours.closed') : item.hours}</p>)}
                    </div>
                    <CtaButton href={route('contact')} variant="outline" className="mt-6">{t('location_section.button')}</CtaButton>
                </div>
                <div className="space-y-4">
                    <img src={exteriorImage} alt="Sports35 Fitness Center exterior" className="aspect-[4/3] w-full rounded-xl border border-zinc-800 object-cover object-center" loading="lazy" />
                    {contact.maps_embed && <iframe title={t('location_section.map_title')} src={contact.maps_embed} className="min-h-72 w-full rounded-xl border border-zinc-800" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />}
                </div>
            </div>
        </section>
    );
}
