import { useTranslation } from '@/hooks/useTranslation';

export default function TrainerGrid({ trainers }) {
    const { t } = useTranslation();

    if (!trainers.length) return null;

    return (
        <section className="bg-brand-black py-16 md:py-24">
            <div className="mx-auto max-w-6xl px-4">
                <div className="mb-10 text-center">
                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-red">{t('trainer_section.eyebrow')}</p>
                    <h2 className="text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl">{t('trainer_section.title')}</h2>
                    <p className="mx-auto mt-3 max-w-2xl text-zinc-400">{t('trainer_section.subtitle')}</p>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {trainers.map((trainer) => (
                        <article key={trainer.id} className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50">
                            {trainer.photo_url ? (
                                <img src={trainer.photo_url} alt={trainer.name} className="aspect-[4/3] w-full object-cover" loading="lazy" />
                            ) : (
                                <div className="flex aspect-[4/3] items-center justify-center bg-zinc-800 text-4xl font-black text-zinc-600" aria-hidden="true">{trainer.name.charAt(0)}</div>
                            )}
                            <div className="p-5">
                                <h3 className="text-lg font-bold text-white">{trainer.name}</h3>
                                {trainer.role && <p className="mt-1 text-sm font-medium text-brand-red">{trainer.role}</p>}
                                {trainer.specialties && <p className="mt-3 text-sm text-zinc-300">{trainer.specialties}</p>}
                                {trainer.bio && <p className="mt-2 text-sm leading-relaxed text-zinc-400">{trainer.bio}</p>}
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
