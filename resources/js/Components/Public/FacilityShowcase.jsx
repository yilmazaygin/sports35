import { Link } from '@inertiajs/react';
import { useTranslation } from '@/hooks/useTranslation';

export default function FacilityShowcase({ facilities }) {
    const { t } = useTranslation();

    if (!facilities.length) return null;

    return (
        <section className="bg-zinc-950 py-16 md:py-24">
            <div className="mx-auto max-w-6xl px-4">
                <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-red">{t('facility_section.eyebrow')}</p>
                        <h2 className="text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl">{t('facility_section.title')}</h2>
                        <p className="mt-3 max-w-2xl text-zinc-400">{t('facility_section.subtitle')}</p>
                    </div>
                    <Link href={route('gallery')} className="text-sm font-bold text-brand-red hover:underline">{t('facility_section.gallery_link')}</Link>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {facilities.map((facility) => (
                        <article key={facility.id} className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50">
                            {facility.image_url && <img src={facility.image_url} alt={facility.name} className="aspect-[4/3] w-full object-cover object-center" loading="lazy" />}
                            <div className="p-5">
                                <p className="text-xs font-bold uppercase tracking-wider text-brand-red">{t(`facility_categories.${facility.category}`)}</p>
                                <h3 className="mt-2 text-lg font-bold text-white">{facility.name}</h3>
                                {facility.description && <p className="mt-2 text-sm leading-relaxed text-zinc-400">{facility.description}</p>}
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
