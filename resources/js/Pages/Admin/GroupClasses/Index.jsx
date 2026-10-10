import AdminLayout from '@/Layouts/AdminLayout';
import FlashMessage from '@/Components/Admin/FlashMessage';
import Checkbox from '@/Components/Checkbox';
import TextInput from '@/Components/TextInput';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { confirmDelete } from '@/utils/confirmDelete';
import Pagination from '@/Components/Admin/Pagination';

export default function Index({ classes, pagination = [], search = '' }) {
    const { t } = useTranslation('admin');
    const [editingId, setEditingId] = useState(null);
    const form = useForm({ name_tr: '', name_en: '', description_tr: '', description_en: '', difficulty_tr: '', difficulty_en: '', schedule_text_tr: '', schedule_text_en: '', instructor_name_tr: '', instructor_name_en: '', sort_order: classes.length + 1, is_active: true });
    const submit = (e) => { e.preventDefault(); router.post(editingId ? route('group-classes.update', editingId) : route('group-classes.store'), editingId ? { ...form.data, _method: 'put' } : form.data, { onSuccess: () => { form.reset(); setEditingId(null); } }); };
    const startEdit = (item) => { setEditingId(item.id); form.setData({ name_tr: item.name_tr, name_en: item.name_en, description_tr: item.description_tr || '', description_en: item.description_en || '', difficulty_tr: item.difficulty_tr || '', difficulty_en: item.difficulty_en || '', schedule_text_tr: item.schedule_text_tr || '', schedule_text_en: item.schedule_text_en || '', instructor_name_tr: item.instructor_name_tr || '', instructor_name_en: item.instructor_name_en || '', sort_order: item.sort_order, is_active: item.is_active }); };
    return <AdminLayout header={<h1 className="text-2xl font-bold">{t('group_classes.title')}</h1>}>
        <Head title={t('group_classes.title')} /><FlashMessage />
        <form onSubmit={(e) => { e.preventDefault(); router.get(route('group-classes.index'), { search: e.currentTarget.search.value }); }} className="mb-4 flex gap-2"><TextInput name="search" defaultValue={search} placeholder={t('common.search')} /><button className="rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white">{t('common.search')}</button></form>
        <form onSubmit={submit} className="mb-8 grid gap-4 rounded-xl border bg-white p-6 sm:grid-cols-2">
            <TextInput placeholder={t('group_classes.name_tr')} value={form.data.name_tr} onChange={(e) => form.setData('name_tr', e.target.value)} /><TextInput placeholder={t('group_classes.name_en')} value={form.data.name_en} onChange={(e) => form.setData('name_en', e.target.value)} />
            <textarea className="rounded-md border-zinc-300" placeholder={t('group_classes.description_tr')} value={form.data.description_tr} onChange={(e) => form.setData('description_tr', e.target.value)} /><textarea className="rounded-md border-zinc-300" placeholder={t('group_classes.description_en')} value={form.data.description_en} onChange={(e) => form.setData('description_en', e.target.value)} />
            <TextInput placeholder={t('group_classes.difficulty_tr')} value={form.data.difficulty_tr} onChange={(e) => form.setData('difficulty_tr', e.target.value)} /><TextInput placeholder={t('group_classes.difficulty_en')} value={form.data.difficulty_en} onChange={(e) => form.setData('difficulty_en', e.target.value)} />
            <TextInput placeholder={t('group_classes.schedule_tr')} value={form.data.schedule_text_tr} onChange={(e) => form.setData('schedule_text_tr', e.target.value)} /><TextInput placeholder={t('group_classes.schedule_en')} value={form.data.schedule_text_en} onChange={(e) => form.setData('schedule_text_en', e.target.value)} />
            <TextInput placeholder={t('group_classes.instructor_tr')} value={form.data.instructor_name_tr} onChange={(e) => form.setData('instructor_name_tr', e.target.value)} /><TextInput placeholder={t('group_classes.instructor_en')} value={form.data.instructor_name_en} onChange={(e) => form.setData('instructor_name_en', e.target.value)} />
            <label className="flex items-center gap-2"><Checkbox checked={form.data.is_active} onChange={(e) => form.setData('is_active', e.target.checked)} />{t('common.active')}</label><div className="flex gap-3"><button type="submit" className="rounded-lg bg-brand-red px-4 py-2 text-sm font-bold text-white">{editingId ? t('common.save') : t('common.create')}</button>{editingId && <button type="button" onClick={() => { form.reset(); setEditingId(null); }} className="rounded-lg border px-4 py-2 text-sm">{t('common.cancel')}</button>}</div>
        </form>
        <div className="grid gap-4 md:grid-cols-2">{classes.map((item) => <article key={item.id} className="rounded-xl border bg-white p-5"><h2 className="font-bold">{item.name_tr}</h2><p className="mt-1 text-sm text-zinc-500">{item.schedule_text_tr}</p><button onClick={() => startEdit(item)} className="mt-3 mr-3 text-sm text-brand-red">{t('common.edit')}</button><button onClick={() => confirmDelete(t('common.confirm_delete')) && router.delete(route('group-classes.destroy', item.id))} className="mt-3 text-sm text-red-600">{t('common.delete')}</button></article>)}</div><Pagination links={pagination} />
    </AdminLayout>;
}
