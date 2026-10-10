import AdminLayout from '@/Layouts/AdminLayout';
import FlashMessage from '@/Components/Admin/FlashMessage';
import Checkbox from '@/Components/Checkbox';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import { Head, router, useForm } from '@inertiajs/react';
import { useTranslation } from '@/hooks/useTranslation';
import { confirmDelete } from '@/utils/confirmDelete';
import Pagination from '@/Components/Admin/Pagination';
import { useState } from 'react';

export default function Index({ categories, items, pagination = [], search = '' }) {
    const { t } = useTranslation('admin');
    const [editingItem, setEditingItem] = useState(null);

    const catForm = useForm({ name_tr: '', name_en: '', sort_order: categories.length + 1 });
    const itemForm = useForm({
        gallery_category_id: categories[0]?.id || '',
        image: null,
        caption_tr: '',
        caption_en: '',
        instagram_url: '',
        sort_order: 0,
        is_active: true,
    });
    const editForm = useForm({
        gallery_category_id: '',
        image: null,
        caption_tr: '',
        caption_en: '',
        alt_tr: '',
        alt_en: '',
        instagram_url: '',
        sort_order: 0,
        is_active: true,
    });

    const beginEdit = (item) => {
        setEditingItem(item);
        editForm.setData({
            gallery_category_id: item.gallery_category_id,
            image: null,
            caption_tr: item.caption_tr || '',
            caption_en: item.caption_en || '',
            alt_tr: item.alt_tr || '',
            alt_en: item.alt_en || '',
            instagram_url: item.instagram_url || '',
            sort_order: item.sort_order || 0,
            is_active: item.is_active,
        });
    };

    const cancelEdit = () => {
        setEditingItem(null);
        editForm.reset();
        editForm.clearErrors();
    };

    return (
        <AdminLayout header={<h1 className="text-2xl font-bold">{t('gallery.title')}</h1>}>
            <Head title={t('gallery.title')} />
            <FlashMessage />
            {editingItem && (
                <div className="mb-8 rounded-xl border border-brand-red/30 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between gap-4">
                        <div>
                            <h2 className="font-semibold">{t('gallery.edit_item')}</h2>
                            <p className="mt-1 text-sm text-zinc-500">{t('gallery.edit_item_hint')}</p>
                        </div>
                        <button type="button" onClick={cancelEdit} className="text-sm text-zinc-600 hover:text-zinc-900">{t('common.cancel')}</button>
                    </div>
                    <form onSubmit={(e) => { e.preventDefault(); editForm.post(route('gallery.items.update', editingItem.id), { forceFormData: true, onSuccess: cancelEdit }); }} className="grid gap-4 lg:grid-cols-[180px_1fr]">
                        <div>
                            <img src={editingItem.image_url} alt={editingItem.alt_tr || editingItem.caption_tr || editingItem.category_name || t('gallery.image')} className="aspect-square w-full rounded-lg object-cover" />
                            <p className="mt-2 text-xs text-zinc-500">{t('gallery.image_unchanged')}</p>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <InputLabel value={t('gallery.caption_tr')} />
                                <TextInput className="mt-1 w-full" value={editForm.data.caption_tr} onChange={(e) => editForm.setData('caption_tr', e.target.value)} />
                                <InputError message={editForm.errors.caption_tr} className="mt-1" />
                            </div>
                            <div>
                                <InputLabel value={t('gallery.caption_en')} />
                                <TextInput className="mt-1 w-full" value={editForm.data.caption_en} onChange={(e) => editForm.setData('caption_en', e.target.value)} />
                                <InputError message={editForm.errors.caption_en} className="mt-1" />
                            </div>
                            <div>
                                <InputLabel value={t('gallery.alt_tr')} />
                                <TextInput className="mt-1 w-full" value={editForm.data.alt_tr} onChange={(e) => editForm.setData('alt_tr', e.target.value)} />
                                <InputError message={editForm.errors.alt_tr} className="mt-1" />
                            </div>
                            <div>
                                <InputLabel value={t('gallery.alt_en')} />
                                <TextInput className="mt-1 w-full" value={editForm.data.alt_en} onChange={(e) => editForm.setData('alt_en', e.target.value)} />
                                <InputError message={editForm.errors.alt_en} className="mt-1" />
                            </div>
                            <div className="flex items-end gap-3 sm:col-span-2">
                                <button type="submit" disabled={editForm.processing} className="rounded-lg bg-brand-red px-4 py-2 text-sm font-bold text-white">{t('common.save')}</button>
                                <button type="button" onClick={cancelEdit} className="rounded-lg border px-4 py-2 text-sm">{t('common.cancel')}</button>
                            </div>
                        </div>
                    </form>
                </div>
            )}
            <form onSubmit={(e) => { e.preventDefault(); router.get(route('gallery.index'), { search: e.currentTarget.search.value }); }} className="mb-4 flex gap-2"><TextInput name="search" defaultValue={search} placeholder={t('common.search')} /><button className="rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white">{t('common.search')}</button></form>

            <div className="mb-8 rounded-xl border bg-white p-6">
                <h2 className="mb-4 font-semibold">{t('gallery.add_category')}</h2>
                <form onSubmit={(e) => { e.preventDefault(); catForm.post(route('gallery.categories.store'), { onSuccess: () => catForm.reset() }); }}
                    className="grid gap-4 sm:grid-cols-3">
                    <TextInput placeholder={t('gallery.name_tr')} value={catForm.data.name_tr} onChange={(e) => catForm.setData('name_tr', e.target.value)} />
                    <TextInput placeholder={t('gallery.name_en')} value={catForm.data.name_en} onChange={(e) => catForm.setData('name_en', e.target.value)} />
                    <button type="submit" className="rounded-lg bg-brand-red px-4 py-2 text-sm font-bold text-white">{t('common.create')}</button>
                </form>
            </div>

            <div className="mb-8 rounded-xl border bg-white p-6">
                <h2 className="mb-4 font-semibold">{t('gallery.add_item')}</h2>
                <form onSubmit={(e) => { e.preventDefault(); itemForm.post(route('gallery.items.store'), { forceFormData: true, onSuccess: () => itemForm.reset() }); }}
                    className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <InputLabel value={t('gallery.category')} />
                        <select className="mt-1 w-full rounded-md border-zinc-300" value={itemForm.data.gallery_category_id}
                            onChange={(e) => itemForm.setData('gallery_category_id', e.target.value)}>
                            {categories.map((c) => <option key={c.id} value={c.id}>{c.name_tr}</option>)}
                        </select>
                    </div>
                    <div>
                        <InputLabel value={t('gallery.image')} />
                        <input type="file" accept="image/*" className="mt-1 block w-full text-sm"
                            onChange={(e) => itemForm.setData('image', e.target.files[0])} />
                    </div>
                    <TextInput placeholder={t('gallery.caption_tr')} value={itemForm.data.caption_tr} onChange={(e) => itemForm.setData('caption_tr', e.target.value)} />
                    <TextInput placeholder={t('gallery.caption_en')} value={itemForm.data.caption_en} onChange={(e) => itemForm.setData('caption_en', e.target.value)} />
                    <TextInput placeholder="Instagram URL" value={itemForm.data.instagram_url} onChange={(e) => itemForm.setData('instagram_url', e.target.value)} />
                    <div className="flex items-end">
                        <button type="submit" className="rounded-lg bg-brand-red px-4 py-2 text-sm font-bold text-white">{t('common.upload')}</button>
                    </div>
                </form>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                    <div key={item.id} className="overflow-hidden rounded-xl border bg-white">
                        <img src={item.image_url} alt={item.caption_tr || item.category_name || t('gallery.image')} className="aspect-square w-full object-cover" />
                        <div className="p-3">
                            <p className="text-sm font-medium">{item.category_name}</p>
                            <p className="text-xs text-zinc-500">{item.caption_tr}</p>
                            <button onClick={() => beginEdit(item)} className="mt-2 mr-3 text-sm font-medium text-brand-red hover:underline">{t('common.edit')}</button>
                            <button onClick={() => confirmDelete(t('common.confirm_delete')) && router.delete(route('gallery.items.destroy', item.id))}
                                className="mt-2 text-sm text-red-600">{t('common.delete')}</button>
                        </div>
                    </div>
                ))}
            </div>
            <Pagination links={pagination} />
        </AdminLayout>
    );
}
