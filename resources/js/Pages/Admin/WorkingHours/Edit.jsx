import AdminLayout from '@/Layouts/AdminLayout';
import FlashMessage from '@/Components/Admin/FlashMessage';
import TimeInput from '@/Components/Admin/TimeInput';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import { Button, PageHeader, Panel } from '@/Components/Admin/ui';
import { Head, useForm } from '@inertiajs/react';
import { useTranslation } from '@/hooks/useTranslation';
import { groupsForLayout } from '@/utils/workingHourLayouts';

const layoutKeys = ['daily', 'split', 'weekend'];

export default function Edit({ hours, layout }) {
    const { t } = useTranslation('admin');
    const form = useForm({
        layout: layout || 'daily',
        hours: hours.map((hour) => ({
            day_key: hour.day_key,
            opens_at: hour.opens_at || '09:00',
            closes_at: hour.closes_at || '22:00',
            is_closed: hour.is_closed,
        })),
    });

    const updateGroup = (days, field, value) => {
        form.setData('hours', form.data.hours.map((hour) => (
            days.includes(hour.day_key) ? { ...hour, [field]: value } : hour
        )));
    };

    const submit = (event) => {
        event.preventDefault();
        form.transform((data) => ({
            layout: data.layout,
            groups: groupsForLayout(data.layout).map((group) => {
                const sample = data.hours.find((hour) => hour.day_key === group.days[0]);

                return {
                    key: group.key,
                    opens_at: sample?.opens_at,
                    closes_at: sample?.closes_at,
                    is_closed: Boolean(sample?.is_closed),
                };
            }),
        }));
        form.put(route('working-hours.update'));
    };

    const groups = groupsForLayout(form.data.layout).map((group) => ({
        ...group,
        sample: form.data.hours.find((hour) => hour.day_key === group.days[0]),
    }));

    return (
        <AdminLayout header={
            <PageHeader title={t('working_hours.title')} description={t('working_hours.subtitle')} />
        }>
            <Head title={t('working_hours.title')} />
            <FlashMessage />

            <form onSubmit={submit}>
                <Panel>
                    <h2 className="text-base font-semibold text-zinc-950">{t('working_hours.layout')}</h2>
                    <p className="mt-1 text-sm leading-6 text-zinc-500">{t('working_hours.layout_hint')}</p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                        {layoutKeys.map((key) => {
                            const selected = form.data.layout === key;

                            return (
                                <button
                                    key={key}
                                    type="button"
                                    aria-pressed={selected}
                                    onClick={() => form.setData('layout', key)}
                                    className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${selected ? 'border-brand-red bg-orange-50 text-zinc-950 ring-1 ring-brand-red' : 'border-zinc-200 text-zinc-600 hover:border-zinc-300'}`}
                                >
                                    {t(`working_hours.layouts.${key}`)}
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-8 divide-y divide-zinc-100">
                        {groups.map((group) => (
                            <div key={group.key} className={`grid items-end gap-4 py-4 sm:grid-cols-[minmax(8rem,1fr)_repeat(2,minmax(9rem,13rem))_auto] ${group.sample?.is_closed ? 'opacity-60' : ''}`}>
                                <div className="pb-2 font-medium text-zinc-950">{t(`working_hours.${group.label}`)}</div>
                                <div>
                                    <InputLabel htmlFor={`${group.key}-opens`} value={t('working_hours.opens')} />
                                    <TimeInput
                                        id={`${group.key}-opens`}
                                        label={t('working_hours.opens')}
                                        value={group.sample?.opens_at || ''}
                                        disabled={group.sample?.is_closed}
                                        onChange={(value) => updateGroup(group.days, 'opens_at', value)}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <InputLabel htmlFor={`${group.key}-closes`} value={t('working_hours.closes')} />
                                    <TimeInput
                                        id={`${group.key}-closes`}
                                        label={t('working_hours.closes')}
                                        value={group.sample?.closes_at || ''}
                                        disabled={group.sample?.is_closed}
                                        onChange={(value) => updateGroup(group.days, 'closes_at', value)}
                                        className="mt-1"
                                    />
                                </div>
                                <label className="flex items-center gap-2 pb-2">
                                    <Checkbox
                                        checked={Boolean(group.sample?.is_closed)}
                                        onChange={(event) => updateGroup(group.days, 'is_closed', event.target.checked)}
                                    />
                                    <span className="text-sm text-zinc-600">{t('working_hours.is_closed')}</span>
                                </label>
                            </div>
                        ))}
                    </div>
                    <InputError message={form.errors.groups || form.errors.layout} className="mt-4" />
                    <div className="mt-6 flex justify-end">
                        <Button type="submit" disabled={form.processing}>{t('common.save')}</Button>
                    </div>
                </Panel>
            </form>
        </AdminLayout>
    );
}
