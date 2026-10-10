import { useTranslation } from '@/hooks/useTranslation';

export default function GroupClassList({ classes }) {
    const { t } = useTranslation();

    if (!classes.length) return null;

    return (
        <section className="bg-zinc-950 py-16 md:py-24">
            <div className="mx-auto max-w-5xl px-4">
                <div className="mb-10 text-center">
                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-red">{t('classes_section.eyebrow')}</p>
                    <h2 className="text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl">{t('classes_section.title')}</h2>
                    <p className="mx-auto mt-3 max-w-2xl text-zinc-400">{t('classes_section.subtitle')}</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    {classes.map((item) => (
                        <article key={item.id} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                            <h3 className="text-lg font-bold text-white">{item.name}</h3>
                            {item.description && <p className="mt-2 text-sm leading-relaxed text-zinc-400">{item.description}</p>}
                            <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-zinc-300">
                                {item.difficulty && <span className="rounded-full bg-zinc-800 px-3 py-1">{item.difficulty}</span>}
                                {item.schedule && <span className="rounded-full bg-brand-red/15 px-3 py-1 text-brand-red">{item.schedule}</span>}
                                {item.instructor && <span className="rounded-full bg-zinc-800 px-3 py-1">{item.instructor}</span>}
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
