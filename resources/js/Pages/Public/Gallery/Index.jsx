import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

export default function Index({ categories, items, activeCategory }) {
    const { t } = useTranslation();
    const [lightbox, setLightbox] = useState(null);
    const lightboxText = lightbox && lightbox.alt && lightbox.alt !== t('gallery_page.title')
        ? lightbox.alt
        : lightbox?.caption || null;

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

    return (
        <PublicLayout>
            <Head title={t('seo.gallery_title')} />

            <section className="bg-brand-black py-12 md:py-16">
                <div className="mx-auto max-w-6xl px-4">
                    <div className="mb-10 text-center">
                        <h1 className="text-3xl font-black uppercase text-white sm:text-4xl">{t('gallery_page.title')}</h1>
                        <p className="mt-3 text-zinc-400">{t('gallery_page.subtitle')}</p>
                    </div>

                    {categories.length > 0 && (
                        <div className="-mx-4 mb-8 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0 sm:pb-0">
                            <Link
                                href={route('gallery')}
                                className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                                    !activeCategory ? 'bg-brand-red text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                                }`}
                            >
                                {t('gallery_page.all')}
                            </Link>
                            {categories.map((cat) => (
                                <Link
                                    key={cat.id}
                                    href={route('gallery', { category: cat.slug })}
                                    className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                                        activeCategory === cat.slug ? 'bg-brand-red text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                                    }`}
                                >
                                    {cat.name}
                                </Link>
                            ))}
                        </div>
                    )}

                    {items.length === 0 ? (
                        <p className="text-center text-zinc-400">{t('gallery_page.empty')}</p>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="group overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900"
                                >
                                    <button
                                        type="button"
                                        onClick={() => setLightbox(item)}
                                        className="block w-full"
                                    >
                                        <img
                                            src={item.image_url}
                                            alt={item.alt || item.caption || t('gallery_page.title')}
                                            className="aspect-square w-full object-cover transition group-hover:scale-105"
                                            loading="lazy"
                                        />
                                    </button>
                                    {(item.caption || item.instagram_url) && (
                                        <div className="p-4">
                                            {item.caption && (
                                                <p className="text-sm text-zinc-300">{item.caption}</p>
                                            )}
                                            {item.instagram_url && (
                                                <a
                                                    href={item.instagram_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="mt-2 inline-block text-xs font-medium text-brand-red hover:underline"
                                                >
                                                    {t('gallery_page.view_instagram')}
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {lightbox && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
                    onClick={() => setLightbox(null)}
                    role="dialog"
                    aria-modal="true"
                    aria-label={lightboxText || t('gallery_page.title')}
                >
                    <button
                        type="button"
                        onClick={() => setLightbox(null)}
                        className="absolute right-4 top-4 z-10 text-sm font-medium text-zinc-300 hover:text-white"
                    >
                        {t('gallery_page.close')}
                    </button>
                    <figure className="flex max-h-[90vh] max-w-5xl flex-col items-center overflow-y-auto" onClick={(event) => event.stopPropagation()}>
                        <img
                            src={lightbox.image_url}
                            alt={lightbox.alt || lightbox.caption || t('gallery_page.title')}
                            className="max-h-[75vh] max-w-full rounded-lg object-contain"
                        />
                        {lightboxText && (
                            <figcaption className="mt-4 max-w-3xl text-center text-sm leading-relaxed text-zinc-200 sm:text-base">
                                {lightboxText}
                            </figcaption>
                        )}
                    </figure>
                </div>
            )}
        </PublicLayout>
    );
}
