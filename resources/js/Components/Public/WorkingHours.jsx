import { useTranslation } from '@/hooks/useTranslation';

export default function WorkingHours({ hours }) {
    const { t } = useTranslation();

    return (
        <section className="bg-zinc-950 py-16">
            <div className="mx-auto max-w-4xl px-4">
                <h2 className="mb-8 text-center text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl">
                    {t('hours.title')}
                </h2>
                <div className="divide-y divide-zinc-800 rounded-xl border border-zinc-800 bg-zinc-900/50">
                    {hours.map((item) => (
                        <div
                            key={item.day}
                            className="flex items-center justify-between px-6 py-4"
                        >
                            <span className="font-medium text-zinc-300">
                                {t(`hours.days.${item.day}`)}
                            </span>
                            <span className="font-bold text-brand-red">
                                {item.is_closed || !item.hours
                                    ? t('hours.closed')
                                    : item.hours}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
