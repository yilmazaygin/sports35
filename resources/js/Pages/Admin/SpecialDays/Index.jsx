import AdminLayout from '@/Layouts/AdminLayout';
import FlashMessage from '@/Components/Admin/FlashMessage';
import Checkbox from '@/Components/Checkbox';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { confirmDelete } from '@/utils/confirmDelete';

const empty = {
    date: '', type: 'other', message_tr: '', message_en: '',
    opens_at: '', closes_at: '', is_closed: false, show_banner: true, is_active: true,
};

export default function Index({ specialDays, types }) {
    const { t } = useTranslation('admin');
    const [editingId, setEditingId] = useState(null);
    const createForm = useForm({ ...empty });
    const editForm = useForm({ ...empty });

    return (
        <AdminLayout header={
            <div>
                <h1 className="text-2xl font-bold text-zinc-900">{t('special_days.title')}</h1>
                <p className="mt-1 text-sm text-zinc-500">{t('special_days.subtitle')}</p>
            </div>
        }>
            <Head title={t('special_days.title')} />
            <FlashMessage />

            <div className="mb-8 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 font-semibold">{t('special_days.add')}</h2>
                <SpecialDayForm form={createForm} types={types} t={t}
                    onSubmit={() => createForm.post(route('special-days.store'), { onSuccess: () => createForm.reset() })} />
            </div>

            <div className="space-y-4">
                {specialDays.map((day) => (
                    <div key={day.id} className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
                        {editingId === day.id ? (
                            <SpecialDayForm form={editForm} types={types} t={t}
                                onSubmit={() => editForm.put(route('special-days.update', day.id), { onSuccess: () => setEditingId(null) })}
                                extra={<button type="button" onClick={() => setEditingId(null)} className="text-zinc-500">{t('common.cancel')}</button>} />
                        ) : (
                            <div className="flex justify-between">
                                <div>
                                    <p className="font-bold text-zinc-900">{day.date} — {t(`special_days.types.${day.type}`)}</p>
                                    <p className="mt-1 text-sm text-zinc-600">{day.message_tr}</p>
                                    {day.show_banner && <span className="mt-2 inline-block rounded bg-brand-red/10 px-2 py-0.5 text-xs text-brand-red">Banner</span>}
                                </div>
                                <div>
                                    <button onClick={() => { setEditingId(day.id); editForm.setData({ ...day, opens_at: day.opens_at?.slice(0,5) || '', closes_at: day.closes_at?.slice(0,5) || '' }); }}
                                        className="mr-3 text-brand-red">{t('common.edit')}</button>
                                    <button onClick={() => confirmDelete(t('common.confirm_delete')) && router.delete(route('special-days.destroy', day.id))} className="text-red-600">{t('common.delete')}</button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </AdminLayout>
    );
}

function SpecialDayForm({ form, types, t, onSubmit, extra }) {
    return (
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="grid gap-4 sm:grid-cols-2">
            <div><InputLabel value={t('special_days.date')} /><TextInput type="date" className="mt-1 w-full" value={form.data.date} onChange={(e) => form.setData('date', e.target.value)} /></div>
            <div>
                <InputLabel value={t('special_days.type')} />
                <select className="mt-1 w-full rounded-md border-zinc-300" value={form.data.type} onChange={(e) => form.setData('type', e.target.value)}>
                    {types.map((type) => <option key={type} value={type}>{t(`special_days.types.${type}`)}</option>)}
                </select>
            </div>
            <div className="sm:col-span-2"><InputLabel value={t('special_days.message_tr')} /><TextInput className="mt-1 w-full" value={form.data.message_tr} onChange={(e) => form.setData('message_tr', e.target.value)} /></div>
            <div className="sm:col-span-2"><InputLabel value={t('special_days.message_en')} /><TextInput className="mt-1 w-full" value={form.data.message_en} onChange={(e) => form.setData('message_en', e.target.value)} /></div>
            <label className="flex items-center gap-2"><Checkbox checked={form.data.show_banner} onChange={(e) => form.setData('show_banner', e.target.checked)} /><span className="text-sm">{t('special_days.show_banner')}</span></label>
            <label className="flex items-center gap-2"><Checkbox checked={form.data.is_active} onChange={(e) => form.setData('is_active', e.target.checked)} /><span className="text-sm">{t('common.active')}</span></label>
            <div className="flex gap-3 sm:col-span-2">
                <button type="submit" className="rounded-lg bg-brand-red px-4 py-2 text-sm font-bold text-white">{t('common.save')}</button>
                {extra}
            </div>
        </form>
    );
}
