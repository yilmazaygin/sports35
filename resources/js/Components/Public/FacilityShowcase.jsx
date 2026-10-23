import { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import { useTranslation } from '@/hooks/useTranslation';

export default function FacilityShowcase({ facilities }) {
    const { t } = useTranslation();
    const [lightbox, setLightbox] = useState(null);

    useEffect(() => {
        if (!lightbox) {
            return undefined;
        }

        const onKey = (event) => {
            if (event.key === 'Escape') {
                setLightbox(null);
            }
        };

        document.addEventListener('keydown', onKey);

        return () => document.removeEventListener('keydown', onKey);
    }, [lightbox]);

    if (!facilities.length) return null;

    return (
        <section id="facilities" className="scroll-mt-28 border-t border-brand-red bg-brand-black py-16 md:py-24">
            <div className="mx-auto max-w-6xl px-4">
                <div className="mb-8 flex flex-col items-stretch justify-between gap-5 sm:mb-10 sm:flex-row sm:items-end sm:gap-6">
                    <div className="max-w-2xl">
                        <h2 className="text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl">{t('facility_section.title')}</h2>
                        <p className="mt-3 text-zinc-400">{t('facility_section.subtitle')}</p>
                    </div>
                    <Link
                        href={route('gallery')}
                        className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-brand-red px-5 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-brand-red/25 transition-colors duration-300 hover:bg-brand-red-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black sm:w-auto sm:justify-start sm:py-2.5"
                    >
                        {t('facility_section.gallery_link')}
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                    </Link>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {facilities.map((facility) => (
                        <article key={facility.id} className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50">
                            {facility.image_url && (
                                <button
                                    type="button"
                                    onClick={() => setLightbox(facility)}
                                    className="block w-full cursor-zoom-in overflow-hidden"
                                    aria-label={facility.name || t('facility_section.title')}
                                >
                                    <img
                                        src={facility.image_url}
                                        alt={facility.name || t('facility_section.title')}
                                        className="aspect-[4/3] w-full object-cover object-center"
                                        loading="lazy"
                                    />
                                </button>
                            )}
                            <div className="p-5">
                                <h3 className="text-lg font-bold text-white">{facility.name}</h3>
                                {facility.description && <p className="mt-2 text-sm leading-relaxed text-zinc-400">{facility.description}</p>}
                            </div>
                        </article>
                    ))}
                </div>
            </div>
            {lightbox && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
                    onClick={() => setLightbox(null)}
                >
                    <img
                        src={lightbox.image_url}
                        alt={lightbox.name || t('facility_section.title')}
                        className="max-h-[90vh] max-w-full rounded-lg"
                    />
                </div>
            )}
        </section>
    );
}
