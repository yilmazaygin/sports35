import AdminLayout from '@/Layouts/AdminLayout';
import FlashMessage from '@/Components/Admin/FlashMessage';
import Checkbox from '@/Components/Checkbox';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import Pagination from '@/Components/Admin/Pagination';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { confirmDelete } from '@/utils/confirmDelete';

export default function Index({ testimonials, search = '', active = '' }) {
    const { t } = useTranslation('admin');
    const [editingId, setEditingId] = useState(null);
    const form = useForm({ name: '', quote_tr: '', quote_en: '', context_tr: '', context_en: '', photo: null, sort_order: testimonials.data.length + 1, is_active: true });
    const submit = (e) => { e.preventDefault(); const payload = editingId ? { ...form.data, _method: 'put' } : form.data; router.post(editingId ? route('testimonials.update', editingId) : route('testimonials.store'), payload, { forceFormData: true, onSuccess: () => { form.reset(); setEditingId(null); } }); };
    const edit = (item) => { setEditingId(item.id); form.setData({ name: item.name, quote_tr: item.quote_tr || '', quote_en: item.quote_en || '', context_tr: item.context_tr || '', context_en: item.context_en || '', photo: null, sort_order: item.sort_order, is_active: item.is_active }); };
    return <AdminLayout header={<h1 className="text-2xl font-bold">{t('testimonials.title')}</h1>}>
        <Head title={t('testimonials.title')} /><FlashMessage />
        <form className="mb-5 flex flex-wrap items-end gap-3" onSubmit={(e) => { e.preventDefault(); router.get(route('testimonials.index'), Object.fromEntries(new FormData(e.currentTarget))); }}><label className="text-sm">{t('common.search')}<input name="search" defaultValue={search} className="mt-1 rounded border-zinc-300" /></label><label className="text-sm">{t('common.status')}<select name="active" defaultValue={active} className="mt-1 rounded border-zinc-300"><option value="">{t('common.all')}</option><option value="active">{t('common.active')}</option><option value="inactive">{t('common.inactive')}</option></select></label><button className="rounded bg-brand-red px-4 py-2 text-sm font-bold text-white">{t('analytics.apply')}</button></form>
        <form onSubmit={submit} className="mb-8 grid gap-4 rounded-xl border bg-white p-6 sm:grid-cols-2"><div><InputLabel value={t('testimonials.name')} /><TextInput className="mt-1 w-full" value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} /></div><div><InputLabel value={t('testimonials.photo')} /><input type="file" accept="image/*" className="mt-1 block w-full" onChange={(e) => form.setData('photo', e.target.files[0])} /></div><textarea className="rounded-md border-zinc-300" placeholder={t('testimonials.quote_tr')} value={form.data.quote_tr} onChange={(e) => form.setData('quote_tr', e.target.value)} /><textarea className="rounded-md border-zinc-300" placeholder={t('testimonials.quote_en')} value={form.data.quote_en} onChange={(e) => form.setData('quote_en', e.target.value)} /><TextInput placeholder={t('testimonials.context_tr')} value={form.data.context_tr} onChange={(e) => form.setData('context_tr', e.target.value)} /><TextInput placeholder={t('testimonials.context_en')} value={form.data.context_en} onChange={(e) => form.setData('context_en', e.target.value)} /><label className="flex items-center gap-2"><Checkbox checked={form.data.is_active} onChange={(e) => form.setData('is_active', e.target.checked)} />{t('common.active')}</label><div className="flex gap-3"><button type="submit" className="rounded-lg bg-brand-red px-4 py-2 text-sm font-bold text-white">{editingId ? t('common.save') : t('common.create')}</button>{editingId && <button type="button" onClick={() => { form.reset(); setEditingId(null); }} className="rounded-lg border px-4 py-2 text-sm">{t('common.cancel')}</button>}</div></form>
        <div className="grid gap-4 md:grid-cols-2">{testimonials.data.map((item) => <article key={item.id} className="rounded-xl border bg-white p-5">{item.photo_url && <img src={item.photo_url} alt={item.name} className="mb-4 h-20 w-20 rounded-full object-cover" />}<h2 className="font-bold">{item.name}</h2><p className="mt-2 text-sm text-zinc-600">{item.quote_tr || item.quote_en}</p><button onClick={() => edit(item)} className="mt-3 mr-3 text-sm text-brand-red">{t('common.edit')}</button><button onClick={() => confirmDelete(t('common.confirm_delete')) && router.delete(route('testimonials.destroy', item.id))} className="mt-3 text-sm text-red-600">{t('common.delete')}</button></article>)}</div>
        <Pagination links={testimonials.links} />
    </AdminLayout>;
}
