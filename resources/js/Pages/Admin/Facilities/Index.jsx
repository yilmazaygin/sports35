import AdminLayout from '@/Layouts/AdminLayout';
import FlashMessage from '@/Components/Admin/FlashMessage';
import Checkbox from '@/Components/Checkbox';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { confirmDelete } from '@/utils/confirmDelete';
import Pagination from '@/Components/Admin/Pagination';

export default function Index({ facilities, pagination = [], search = '' }) {
    const { t } = useTranslation('admin');
    const [editingId, setEditingId] = useState(null);
    const form = useForm({ name_tr: '', name_en: '', category: 'other', description_tr: '', description_en: '', image: null, sort_order: facilities.length + 1, is_active: true });
    const submit = (e) => { e.preventDefault(); router.post(editingId ? route('facilities.update', editingId) : route('facilities.store'), editingId ? { ...form.data, _method: 'put' } : form.data, { forceFormData: true, onSuccess: () => { form.reset(); setEditingId(null); } }); };
    const startEdit = (item) => { setEditingId(item.id); form.setData({ name_tr: item.name_tr, name_en: item.name_en, category: item.category, description_tr: item.description_tr || '', description_en: item.description_en || '', image: null, sort_order: item.sort_order, is_active: item.is_active }); };
    return <AdminLayout header={<h1 className="text-2xl font-bold">{t('facilities.title')}</h1>}>
        <Head title={t('facilities.title')} /><FlashMessage />
        <form onSubmit={(e) => { e.preventDefault(); router.get(route('facilities.index'), { search: e.currentTarget.search.value }); }} className="mb-4 flex gap-2"><TextInput name="search" defaultValue={search} placeholder={t('common.search')} /><button className="rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white">{t('common.search')}</button></form>
        <form onSubmit={submit} className="mb-8 grid gap-4 rounded-xl border bg-white p-6 sm:grid-cols-2">
            <TextInput placeholder={t('facilities.name_tr')} value={form.data.name_tr} onChange={(e) => form.setData('name_tr', e.target.value)} /><TextInput placeholder={t('facilities.name_en')} value={form.data.name_en} onChange={(e) => form.setData('name_en', e.target.value)} />
            <div><InputLabel value={t('facilities.category')} /><select className="mt-1 w-full rounded-md border-zinc-300" value={form.data.category} onChange={(e) => form.setData('category', e.target.value)}>{['cardio', 'strength', 'functional', 'locker', 'other'].map((category) => <option key={category} value={category}>{t(`facility_categories.${category}`)}</option>)}</select></div>
            <div><InputLabel value={t('facilities.image')} /><input type="file" accept="image/*" className="mt-1 block w-full" onChange={(e) => form.setData('image', e.target.files[0])} /></div>
            <textarea className="rounded-md border-zinc-300" placeholder={t('facilities.description_tr')} value={form.data.description_tr} onChange={(e) => form.setData('description_tr', e.target.value)} /><textarea className="rounded-md border-zinc-300" placeholder={t('facilities.description_en')} value={form.data.description_en} onChange={(e) => form.setData('description_en', e.target.value)} />
            <label className="flex items-center gap-2"><Checkbox checked={form.data.is_active} onChange={(e) => form.setData('is_active', e.target.checked)} />{t('common.active')}</label><div className="flex gap-3"><button type="submit" className="rounded-lg bg-brand-red px-4 py-2 text-sm font-bold text-white">{editingId ? t('common.save') : t('common.create')}</button>{editingId && <button type="button" onClick={() => { form.reset(); setEditingId(null); }} className="rounded-lg border px-4 py-2 text-sm">{t('common.cancel')}</button>}</div>
        </form>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{facilities.map((facility) => <article key={facility.id} className="overflow-hidden rounded-xl border bg-white">{facility.image_url && <img src={facility.image_url} alt={facility.name_tr} className="aspect-[16/10] w-full object-cover" />}<div className="p-4"><h2 className="font-bold">{facility.name_tr}</h2><p className="text-sm text-zinc-500">{t(`facility_categories.${facility.category}`)}</p><button onClick={() => startEdit(facility)} className="mt-3 mr-3 text-sm text-brand-red">{t('common.edit')}</button><button onClick={() => confirmDelete(t('common.confirm_delete')) && router.delete(route('facilities.destroy', facility.id))} className="mt-3 text-sm text-red-600">{t('common.delete')}</button></div></article>)}</div><Pagination links={pagination} />
    </AdminLayout>;
}
