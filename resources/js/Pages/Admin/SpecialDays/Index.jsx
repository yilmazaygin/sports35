import AdminLayout from '@/Layouts/AdminLayout';
import FlashMessage from '@/Components/Admin/FlashMessage';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Badge, Button, Empty, PageHeader, Panel, useComposer } from '@/Components/Admin/ui';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { confirmDelete } from '@/utils/confirmDelete';

const empty = {
    starts_on: '', ends_on: '', message_tr: '', message_en: '',
    opens_at: '', closes_at: '', is_closed: false, show_banner: true, is_active: true,
};

function formatRange(day) {
    if (!day.ends_on || day.starts_on === day.ends_on) {
        return day.starts_on;
    }

    return `${day.starts_on} — ${day.ends_on}`;
}

export default function Index({ specialDays }) {
    const { t } = useTranslation('admin');
    const [editingId, setEditingId] = useState(null);
    const createForm = useForm({ ...empty });
    const editForm = useForm({ ...empty });
    const composer = useComposer(createForm);

    function startEdit(day) {
        setEditingId(day.id);
        editForm.setData({
            starts_on: String(day.starts_on).slice(0, 10),
            ends_on: String(day.ends_on).slice(0, 10),
            message_tr: day.message_tr,
            message_en: day.message_en,
            opens_at: day.opens_at?.slice(0, 5) || '',
            closes_at: day.closes_at?.slice(0, 5) || '',
            is_closed: day.is_closed,
            show_banner: day.show_banner,
            is_active: day.is_active,
        });
    }

    return (
        <AdminLayout header={
            <PageHeader
                title={t('special_days.title')}
                description={t('special_days.subtitle')}
                actions={(
                    <Button type="button" variant={composer.open ? 'secondary' : 'primary'} onClick={composer.toggle}>
                        {composer.open ? t('common.cancel') : t('special_days.add')}
                    </Button>
                )}
            />
        }>
            <Head title={t('special_days.title')} />
            <FlashMessage />

            {composer.open && (
                <Panel className="mb-6">
                    <h2 className="mb-4 text-base font-semibold text-zinc-950">{t('special_days.add')}</h2>
                    <SpecialDayForm
                        form={createForm}
                        t={t}
                        submitLabel={t('common.create')}
                        onSubmit={() => createForm.post(route('special-days.store'), {
                            onSuccess: () => {
                                createForm.reset();
                                composer.close();
                            },
                        })}
                    />
                </Panel>
            )}

            {specialDays.length === 0 ? (
                <Empty>{t('common.empty')}</Empty>
            ) : (
                <div className="space-y-3">
                    {specialDays.map((day) => (
                        <Panel key={day.id}>
                            {editingId === day.id ? (
                                <SpecialDayForm
                                    form={editForm}
                                    t={t}
                                    submitLabel={t('common.save')}
                                    onSubmit={() => editForm.put(route('special-days.update', day.id), { onSuccess: () => setEditingId(null) })}
                                    extra={<Button type="button" variant="secondary" onClick={() => setEditingId(null)}>{t('common.cancel')}</Button>}
                                />
                            ) : (
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <p className="font-semibold text-zinc-950">{formatRange(day)}</p>
                                            <Badge tone={day.is_active ? 'success' : 'neutral'}>{day.is_active ? t('common.active') : t('common.inactive')}</Badge>
                                            {day.show_banner && <Badge tone="brand">{t('special_days.show_banner')}</Badge>}
                                        </div>
                                        <p className="mt-2 text-sm leading-6 text-zinc-600">{day.message_tr}</p>
                                    </div>
                                    <div className="flex shrink-0 gap-1">
                                        <Button type="button" variant="ghost" size="sm" onClick={() => startEdit(day)}>{t('common.edit')}</Button>
                                        <Button type="button" variant="danger" size="sm" onClick={() => confirmDelete(t('common.confirm_delete')) && router.delete(route('special-days.destroy', day.id))}>{t('common.delete')}</Button>
                                    </div>
                                </div>
                            )}
                        </Panel>
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}

function SpecialDayForm({ form, t, onSubmit, extra, submitLabel }) {
    return (
        <form onSubmit={(event) => { event.preventDefault(); onSubmit(); }} className="grid gap-4 sm:grid-cols-2">
            <div>
                <InputLabel value={t('special_days.starts_on')} />
                <TextInput type="date" className="mt-1 w-full" value={form.data.starts_on} onChange={(event) => form.setData('starts_on', event.target.value)} />
                <InputError message={form.errors.starts_on} className="mt-1" />
            </div>
            <div>
                <InputLabel value={t('special_days.ends_on')} />
                <TextInput type="date" className="mt-1 w-full" value={form.data.ends_on} onChange={(event) => form.setData('ends_on', event.target.value)} />
                <p className="mt-1 text-xs text-zinc-500">{t('special_days.single_day_hint')}</p>
                <InputError message={form.errors.ends_on} className="mt-1" />
            </div>
            <div className="sm:col-span-2">
                <InputLabel value={t('special_days.message_tr')} />
                <TextInput className="mt-1 w-full" value={form.data.message_tr} onChange={(event) => form.setData('message_tr', event.target.value)} />
                <InputError message={form.errors.message_tr} className="mt-1" />
            </div>
            <div className="sm:col-span-2">
                <InputLabel value={t('special_days.message_en')} />
                <TextInput className="mt-1 w-full" value={form.data.message_en} onChange={(event) => form.setData('message_en', event.target.value)} />
                <InputError message={form.errors.message_en} className="mt-1" />
            </div>
            <label className="flex items-center gap-2 text-sm text-zinc-700">
                <Checkbox checked={form.data.show_banner} onChange={(event) => form.setData('show_banner', event.target.checked)} />
                {t('special_days.show_banner')}
            </label>
            <label className="flex items-center gap-2 text-sm text-zinc-700">
                <Checkbox checked={form.data.is_active} onChange={(event) => form.setData('is_active', event.target.checked)} />
                {t('common.active')}
            </label>
            <div className="flex flex-wrap gap-2 sm:col-span-2">
                <Button type="submit" disabled={form.processing}>{submitLabel}</Button>
                {extra}
            </div>
        </form>
    );
}
