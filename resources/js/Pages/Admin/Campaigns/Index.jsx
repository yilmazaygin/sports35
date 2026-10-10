import AdminLayout from '@/Layouts/AdminLayout';
import FlashMessage from '@/Components/Admin/FlashMessage';
import Checkbox from '@/Components/Checkbox';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { confirmDelete } from '@/utils/confirmDelete';

const emptyCampaign = {
    label: '', title_tr: '', title_en: '', discount_percent: 10,
    starts_at: '', ends_at: '', is_active: true,
};

export default function Index({ campaigns }) {
    const { t } = useTranslation('admin');
    const [editingId, setEditingId] = useState(null);
    const createForm = useForm({ ...emptyCampaign });
    const editForm = useForm({ ...emptyCampaign });

    const formatDate = (d) => d ? d.slice(0, 16) : '';

    return (
        <AdminLayout header={
            <div>
                <h1 className="text-2xl font-bold text-zinc-900">{t('campaigns.title')}</h1>
                <p className="mt-1 text-sm text-zinc-500">{t('campaigns.subtitle')}</p>
            </div>
        }>
            <Head title={t('campaigns.title')} />
            <FlashMessage />

            <div className="mb-8 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 font-semibold">{t('campaigns.add')}</h2>
                <CampaignForm form={createForm} t={t} onSubmit={() => createForm.post(route('campaigns.store'), { onSuccess: () => createForm.reset() })} />
            </div>

            <div className="space-y-4">
                {campaigns.map((c) => (
                    <div key={c.id} className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
                        {editingId === c.id ? (
                            <CampaignForm form={editForm} t={t} onSubmit={() => editForm.put(route('campaigns.update', c.id), { onSuccess: () => setEditingId(null) })}
                                extra={<button type="button" onClick={() => setEditingId(null)} className="text-zinc-500">{t('common.cancel')}</button>} />
                        ) : (
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-bold text-zinc-900">{c.title_tr} / {c.title_en}</h3>
                                    <p className="mt-1 text-sm text-zinc-500">{c.label} — %{c.discount_percent}</p>
                                    <p className="text-sm text-zinc-400">{c.is_active ? t('common.active') : t('common.inactive')}</p>
                                </div>
                                <div>
                                    <button onClick={() => { setEditingId(c.id); editForm.setData({ ...c, starts_at: formatDate(c.starts_at), ends_at: formatDate(c.ends_at) }); }}
                                        className="mr-3 text-brand-red">{t('common.edit')}</button>
                                    <button onClick={() => confirmDelete(t('common.confirm_delete')) && router.delete(route('campaigns.destroy', c.id))} className="text-red-600">{t('common.delete')}</button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </AdminLayout>
    );
}

function CampaignForm({ form, t, onSubmit, extra }) {
    return (
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="grid gap-4 sm:grid-cols-2">
            <div><InputLabel value={t('campaigns.label')} /><TextInput className="mt-1 w-full" value={form.data.label} onChange={(e) => form.setData('label', e.target.value)} /></div>
            <div><InputLabel value={t('campaigns.discount')} /><TextInput type="number" className="mt-1 w-full" value={form.data.discount_percent} onChange={(e) => form.setData('discount_percent', e.target.value)} /></div>
            <div><InputLabel value={t('campaigns.title_tr')} /><TextInput className="mt-1 w-full" value={form.data.title_tr} onChange={(e) => form.setData('title_tr', e.target.value)} /></div>
            <div><InputLabel value={t('campaigns.title_en')} /><TextInput className="mt-1 w-full" value={form.data.title_en} onChange={(e) => form.setData('title_en', e.target.value)} /></div>
            <div><InputLabel value={t('campaigns.starts_at')} /><TextInput type="datetime-local" className="mt-1 w-full" value={form.data.starts_at} onChange={(e) => form.setData('starts_at', e.target.value)} /></div>
            <div><InputLabel value={t('campaigns.ends_at')} /><TextInput type="datetime-local" className="mt-1 w-full" value={form.data.ends_at} onChange={(e) => form.setData('ends_at', e.target.value)} /></div>
            <label className="flex items-center gap-2"><Checkbox checked={form.data.is_active} onChange={(e) => form.setData('is_active', e.target.checked)} /><span className="text-sm">{t('common.active')}</span></label>
            <div className="flex gap-3">
                <button type="submit" className="rounded-lg bg-brand-red px-4 py-2 text-sm font-bold text-white">{t('common.save')}</button>
                {extra}
            </div>
        </form>
    );
}
