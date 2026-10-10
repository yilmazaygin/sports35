import { Link } from '@inertiajs/react';
import { useTranslation } from '@/hooks/useTranslation';

export default function TrustFoundation() {
    const { t } = useTranslation();

    return (
        <section className="bg-brand-black py-16 md:py-20">
            <div className="mx-auto max-w-6xl px-4">
                <div className="mb-10 text-center">
                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-red">{t('trust_section.eyebrow')}</p>
                    <h2 className="text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl">{t('trust_section.title')}</h2>
                    <p className="mx-auto mt-3 max-w-2xl text-zinc-400">{t('trust_section.subtitle')}</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                    <Link href={route('transformations')} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 text-center transition hover:border-brand-red/50">
                        <h3 className="font-bold text-white">{t('trust_section.transformations')}</h3>
                    </Link>
                    <Link href={route('gallery')} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 text-center transition hover:border-brand-red/50">
                        <h3 className="font-bold text-white">{t('trust_section.gallery')}</h3>
                    </Link>
                    <Link href={route('blog.index')} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 text-center transition hover:border-brand-red/50">
                        <h3 className="font-bold text-white">{t('trust_section.blog')}</h3>
                    </Link>
                </div>
            </div>
        </section>
    );
}
