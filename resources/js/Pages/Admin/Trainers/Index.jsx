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

export default function Index({ trainers, pagination = [], search = '' }) {
    const { t } = useTranslation('admin');
    const [editingId, setEditingId] = useState(null);
    const form = useForm({ name: '', photo: null, role_tr: '', role_en: '', specialties_tr: '', specialties_en: '', bio_tr: '', bio_en: '', sort_order: trainers.length + 1, is_active: true });

    const submit = (e) => {
        e.preventDefault();
        const payload = editingId ? { ...form.data, _method: 'put' } : form.data;
        router.post(editingId ? route('trainers.update', editingId) : route('trainers.store'), payload, {
            forceFormData: true,
            onSuccess: () => { form.reset(); setEditingId(null); },
        });
    };
    const startEdit = (trainer) => {
        setEditingId(trainer.id);
        form.setData({ name: trainer.name, photo: null, role_tr: trainer.role_tr || '', role_en: trainer.role_en || '', specialties_tr: trainer.specialties_tr || '', specialties_en: trainer.specialties_en || '', bio_tr: trainer.bio_tr || '', bio_en: trainer.bio_en || '', sort_order: trainer.sort_order, is_active: trainer.is_active });
    };

    return <AdminLayout header={<h1 className="text-2xl font-bold">{t('trainers.title')}</h1>}>
        <Head title={t('trainers.title')} /><FlashMessage />
        <form onSubmit={(e) => { e.preventDefault(); router.get(route('trainers.index'), { search: e.currentTarget.search.value }); }} className="mb-4 flex gap-2"><TextInput name="search" defaultValue={search} placeholder={t('common.search')} /><button className="rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white">{t('common.search')}</button></form>
        <form onSubmit={submit} className="mb-8 grid gap-4 rounded-xl border bg-white p-6 sm:grid-cols-2">
            <div><InputLabel value={t('trainers.name')} /><TextInput className="mt-1 w-full" value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} /></div>
            <div><InputLabel value={t('trainers.photo')} /><input type="file" accept="image/*" className="mt-1 block w-full" onChange={(e) => form.setData('photo', e.target.files[0])} /></div>
            <TextInput placeholder={t('trainers.role_tr')} value={form.data.role_tr} onChange={(e) => form.setData('role_tr', e.target.value)} />
            <TextInput placeholder={t('trainers.role_en')} value={form.data.role_en} onChange={(e) => form.setData('role_en', e.target.value)} />
            <TextInput placeholder={t('trainers.specialties_tr')} value={form.data.specialties_tr} onChange={(e) => form.setData('specialties_tr', e.target.value)} />
            <TextInput placeholder={t('trainers.specialties_en')} value={form.data.specialties_en} onChange={(e) => form.setData('specialties_en', e.target.value)} />
            <textarea className="rounded-md border-zinc-300" placeholder={t('trainers.bio_tr')} value={form.data.bio_tr} onChange={(e) => form.setData('bio_tr', e.target.value)} />
            <textarea className="rounded-md border-zinc-300" placeholder={t('trainers.bio_en')} value={form.data.bio_en} onChange={(e) => form.setData('bio_en', e.target.value)} />
            <label className="flex items-center gap-2"><Checkbox checked={form.data.is_active} onChange={(e) => form.setData('is_active', e.target.checked)} />{t('common.active')}</label>
            <div className="flex gap-3"><button type="submit" className="rounded-lg bg-brand-red px-4 py-2 text-sm font-bold text-white">{editingId ? t('common.save') : t('common.create')}</button>{editingId && <button type="button" onClick={() => { form.reset(); setEditingId(null); }} className="rounded-lg border px-4 py-2 text-sm">{t('common.cancel')}</button>}</div>
        </form>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{trainers.map((trainer) => <article key={trainer.id} className="overflow-hidden rounded-xl border bg-white">{trainer.photo_url && <img src={trainer.photo_url} alt={trainer.name} className="aspect-[4/3] w-full object-cover" />}<div className="p-4"><h2 className="font-bold">{trainer.name}</h2><p className="text-sm text-zinc-500">{trainer.role_tr}</p><button onClick={() => startEdit(trainer)} className="mt-3 mr-3 text-sm text-brand-red">{t('common.edit')}</button><button onClick={() => confirmDelete(t('common.confirm_delete')) && router.delete(route('trainers.destroy', trainer.id))} className="mt-3 text-sm text-red-600">{t('common.delete')}</button></div></article>)}</div><Pagination links={pagination} />
    </AdminLayout>;
}
