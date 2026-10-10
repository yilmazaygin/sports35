import { useTranslation } from '@/hooks/useTranslation';

export default function TestimonialSection({ testimonials = [] }) {
    const { t } = useTranslation();
    if (!testimonials.length) return null;

    return <section className="bg-zinc-950 py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4">
            <div className="mb-10 text-center"><p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-red">{t('testimonials.eyebrow')}</p><h2 className="text-2xl font-bold uppercase text-white sm:text-3xl">{t('testimonials.title')}</h2></div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{testimonials.map((item) => <article key={item.id} className="rounded-xl border border-zinc-800 bg-zinc-900 p-6"><div className="flex items-center gap-3">{item.photo_url && <img src={item.photo_url} alt={item.name} className="h-12 w-12 rounded-full object-cover" />}<div><h3 className="font-bold text-white">{item.name}</h3>{item.context && <p className="text-xs text-zinc-500">{item.context}</p>}</div></div><p className="mt-5 leading-relaxed text-zinc-300">“{item.quote}”</p></article>)}</div>
        </div>
    </section>;
}
