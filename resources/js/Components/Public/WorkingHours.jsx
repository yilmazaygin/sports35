import AlertBanner from '@/Components/Public/AlertBanner';
import { useTranslation } from '@/hooks/useTranslation';
import { groupsForLayout } from '@/utils/workingHourLayouts';

function sameSchedule(items) {
    return items.every((item) => item.is_closed === items[0].is_closed && item.hours === items[0].hours);
}

export default function WorkingHours({ hours, alert }) {
    const { t } = useTranslation();
    const days = hours?.days ?? [];
    const groups = groupsForLayout(hours?.layout);

    if (days.length === 0) {
        return null;
    }

    const rows = groups.map((group) => {
        const items = group.days
            .map((day) => days.find((item) => item.day === day))
            .filter(Boolean);

        if (items.length === 0) {
            return null;
        }

        if (sameSchedule(items)) {
            return {
                key: group.key,
                label: t(`hours.${group.label}`),
                is_closed: items[0].is_closed,
                hours: items[0].hours,
            };
        }

        return {
            key: group.key,
            label: t(`hours.${group.label}`),
            items: items.map((item) => ({
                key: item.day,
                label: t(`hours.days.${item.day}`),
                is_closed: item.is_closed,
                hours: item.hours,
            })),
        };
    }).filter(Boolean);

    return (
        <section id="hours" className="scroll-mt-28 border-t border-brand-red bg-brand-surface py-16 md:py-24">
            <div className="mx-auto max-w-3xl px-4">
                <div className="text-center">
                    <h2 className="text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl">
                        {t('hours.title')}
                    </h2>
                    <p className="mt-3 text-zinc-400">{t('hours.subtitle')}</p>
                </div>
                <AlertBanner alert={alert} variant="hours" className="mt-8" />
                <div className={`${alert?.message ? 'mt-6' : 'mt-12'} overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/40`}>
                    {rows.map((row) => (
                        <div key={row.key} className="border-b border-zinc-800 px-6 py-5 last:border-b-0 sm:px-10">
                            {row.items ? (
                                <div className="space-y-3">
                                    <p className="text-sm font-semibold uppercase tracking-[0.14em] text-zinc-400">{row.label}</p>
                                    {row.items.map((item) => (
                                        <div key={item.key} className="flex items-center justify-between gap-6">
                                            <span className="text-base text-zinc-200">{item.label}</span>
                                            <span className={item.is_closed || !item.hours ? 'text-zinc-400' : 'text-base font-semibold text-white'}>
                                                {item.is_closed || !item.hours ? t('hours.closed') : item.hours}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex items-center justify-between gap-6">
                                    <span className="text-base text-zinc-200 sm:text-lg">{row.label}</span>
                                    <span className={row.is_closed || !row.hours ? 'text-zinc-400' : 'text-base font-semibold text-white sm:text-lg'}>
                                        {row.is_closed || !row.hours ? t('hours.closed') : row.hours}
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
