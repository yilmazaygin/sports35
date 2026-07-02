import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

export default function Index({ categories, items, activeCategory }) {
    const { t } = useTranslation();
    const [lightbox, setLightbox] = useState(null);

    return (
        <PublicLayout>
            <Head title={t('gallery_page.title')} />

            <section className="bg-brand-black py-12 md:py-16">
                <div className="mx-auto max-w-6xl px-4">
                    <div className="mb-10 text-center">
                        <h1 className="text-3xl font-black uppercase text-white sm:text-4xl">{t('gallery_page.title')}</h1>
                        <p className="mt-3 text-zinc-400">{t('gallery_page.subtitle')}</p>
                    </div>

                    <div className="mb-8 flex flex-wrap justify-center gap-2">
                        <Link
                            href={route('gallery')}
                            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                                !activeCategory ? 'bg-brand-red text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                            }`}
                        >
                            {t('gallery_page.all')}
                        </Link>
                        {categories.map((cat) => (
                            <Link
                                key={cat.id}
                                href={route('gallery', { category: cat.slug })}
                                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                                    activeCategory === cat.slug ? 'bg-brand-red text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                                }`}
                            >
                                {cat.name}
                            </Link>
                        ))}
                    </div>

                    {items.length === 0 ? (
                        <p className="text-center text-zinc-500">{t('gallery_page.empty')}</p>
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
                                            alt={item.caption || ''}
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
                >
                    <img src={lightbox.image_url} alt="" className="max-h-[90vh] max-w-full rounded-lg" />
                </div>
            )}
        </PublicLayout>
    );
}
