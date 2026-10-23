import AdminLayout from '@/Layouts/AdminLayout';
import FlashMessage from '@/Components/Admin/FlashMessage';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import Pagination from '@/Components/Admin/Pagination';
import { Button, Empty, FilterBar, FormErrors, PageHeader, Panel, useComposer } from '@/Components/Admin/ui';
import { Head, router, useForm } from '@inertiajs/react';
import { useTranslation } from '@/hooks/useTranslation';
import { confirmDelete } from '@/utils/confirmDelete';
import { useState } from 'react';

export default function Index({ categories, items, pagination = [], search = '' }) {
    const { t } = useTranslation('admin');
    const [editingItem, setEditingItem] = useState(null);
    const [editingCategoryId, setEditingCategoryId] = useState(null);

    const catForm = useForm({ name_tr: '', name_en: '', sort_order: categories.length + 1 });
    const categoryEditForm = useForm({ name_tr: '', name_en: '', sort_order: 0 });
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
    const composer = useComposer(itemForm);

    const beginEdit = (item) => {
        setEditingItem(item);
        editForm.clearErrors();
        editForm.setData({
            gallery_category_id: item.gallery_category_id || '',
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

    const beginCategoryEdit = (category) => {
        setEditingCategoryId(category.id);
        categoryEditForm.clearErrors();
        categoryEditForm.setData({
            name_tr: category.name_tr,
            name_en: category.name_en,
            sort_order: category.sort_order,
        });
    };

    return (
        <AdminLayout header={
            <PageHeader
                title={t('gallery.title')}
                description={t('dashboard.hints.gallery')}
                actions={(
                    <Button type="button" variant={composer.open ? 'secondary' : 'primary'} onClick={composer.toggle}>
                        {composer.open ? t('common.cancel') : t('gallery.add_item')}
                    </Button>
                )}
            />
        }>
            <Head title={t('gallery.title')} />
            <FlashMessage />
            <Modal show={editingItem !== null} onClose={cancelEdit} maxWidth="2xl">
                {editingItem && (
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            editForm.post(route('gallery.items.update', editingItem.id), { forceFormData: true, onSuccess: cancelEdit });
                        }}
                        className="p-6"
                    >
                        <div className="mb-4 flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-semibold text-zinc-950">{t('gallery.edit_item')}</h2>
                                <p className="mt-1 text-sm text-zinc-500">{t('gallery.edit_item_hint')}</p>
                            </div>
                            <Button type="button" variant="ghost" size="sm" onClick={cancelEdit}>{t('common.cancel')}</Button>
                        </div>
                        <FormErrors errors={editForm.errors} />
                        <div className="grid gap-4 sm:grid-cols-[160px_1fr]">
                            <div>
                                <img src={editingItem.image_url} alt={editingItem.alt_tr || editingItem.caption_tr || editingItem.category_name || t('gallery.image')} className="aspect-square w-full rounded-xl object-cover" />
                                <p className="mt-2 text-xs text-zinc-500">{t('gallery.image_unchanged')}</p>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <InputLabel value={t('gallery.category')} />
                                    <select className="admin-control mt-1" value={editForm.data.gallery_category_id} onChange={(event) => editForm.setData('gallery_category_id', event.target.value)}>
                                        <option value="">{t('gallery.uncategorized')}</option>
                                        {categories.map((category) => <option key={category.id} value={category.id}>{category.name_tr}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <InputLabel value={t('gallery.caption_tr')} />
                                    <TextInput className="mt-1 w-full" value={editForm.data.caption_tr} onChange={(event) => editForm.setData('caption_tr', event.target.value)} />
                                </div>
                                <div>
                                    <InputLabel value={t('gallery.caption_en')} />
                                    <TextInput className="mt-1 w-full" value={editForm.data.caption_en} onChange={(event) => editForm.setData('caption_en', event.target.value)} />
                                </div>
                                <div>
                                    <InputLabel value={t('gallery.alt_tr')} />
                                    <TextInput className="mt-1 w-full" value={editForm.data.alt_tr} onChange={(event) => editForm.setData('alt_tr', event.target.value)} />
                                </div>
                                <div>
                                    <InputLabel value={t('gallery.alt_en')} />
                                    <TextInput className="mt-1 w-full" value={editForm.data.alt_en} onChange={(event) => editForm.setData('alt_en', event.target.value)} />
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end gap-2">
                            <Button type="button" variant="secondary" onClick={cancelEdit}>{t('common.cancel')}</Button>
                            <Button type="submit" disabled={editForm.processing}>{t('common.save')}</Button>
                        </div>
                    </form>
                )}
            </Modal>

            <div className="grid items-start gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
                <Panel>
                    <h2 className="text-base font-semibold text-zinc-950">{t('gallery.categories')}</h2>
                    <p className="mt-1 text-sm leading-6 text-zinc-500">{t('gallery.categories_hint')}</p>
                    <div className="mt-4 divide-y divide-zinc-100">
                        {categories.length === 0 && <p className="py-4 text-sm text-zinc-500">{t('common.empty')}</p>}
                        {categories.map((category) => (
                            <div key={category.id} className="py-3">
                                {editingCategoryId === category.id ? (
                                    <form
                                        onSubmit={(event) => {
                                            event.preventDefault();
                                            categoryEditForm.put(route('gallery.categories.update', category.id), { onSuccess: () => setEditingCategoryId(null) });
                                        }}
                                        className="space-y-2"
                                    >
                                        <TextInput value={categoryEditForm.data.name_tr} onChange={(event) => categoryEditForm.setData('name_tr', event.target.value)} placeholder={t('gallery.name_tr')} className="w-full" />
                                        <TextInput value={categoryEditForm.data.name_en} onChange={(event) => categoryEditForm.setData('name_en', event.target.value)} placeholder={t('gallery.name_en')} className="w-full" />
                                        <InputError message={categoryEditForm.errors.name_tr || categoryEditForm.errors.name_en} />
                                        <div className="flex gap-2">
                                            <Button type="submit" size="sm">{t('common.save')}</Button>
                                            <Button type="button" variant="secondary" size="sm" onClick={() => setEditingCategoryId(null)}>{t('common.cancel')}</Button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="font-medium text-zinc-950">{category.name_tr}</p>
                                            <p className="text-xs text-zinc-500">{category.name_en} · {category.items_count}</p>
                                        </div>
                                        <div className="flex shrink-0">
                                            <Button type="button" variant="ghost" size="sm" onClick={() => beginCategoryEdit(category)}>{t('common.edit')}</Button>
                                            <Button type="button" variant="danger" size="sm" onClick={() => confirmDelete(t('common.confirm_delete')) && router.delete(route('gallery.categories.destroy', category.id))}>{t('common.delete')}</Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <form
                        onSubmit={(event) => { event.preventDefault(); catForm.post(route('gallery.categories.store'), { onSuccess: () => catForm.reset() }); }}
                        className="mt-4 space-y-2 border-t border-zinc-100 pt-4"
                    >
                        <TextInput placeholder={t('gallery.name_tr')} value={catForm.data.name_tr} onChange={(event) => catForm.setData('name_tr', event.target.value)} className="w-full" />
                        <TextInput placeholder={t('gallery.name_en')} value={catForm.data.name_en} onChange={(event) => catForm.setData('name_en', event.target.value)} className="w-full" />
                        <InputError message={catForm.errors.name_tr || catForm.errors.name_en} />
                        <Button type="submit" disabled={catForm.processing}>{t('gallery.add_category')}</Button>
                    </form>
                </Panel>

                <div className="space-y-4">
                    <FilterBar onSubmit={(event) => { event.preventDefault(); router.get(route('gallery.index'), { search: event.currentTarget.search.value }); }}>
                        <TextInput name="search" defaultValue={search} placeholder={t('common.search')} className="min-w-[14rem] flex-1" />
                        <Button type="submit" variant="secondary">{t('common.search')}</Button>
                    </FilterBar>

                    {composer.open && (
                        <Panel>
                            <h2 className="mb-4 text-base font-semibold text-zinc-950">{t('gallery.add_item')}</h2>
                            <form
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    itemForm.post(route('gallery.items.store'), {
                                        forceFormData: true,
                                        onSuccess: () => {
                                            itemForm.reset();
                                            composer.close();
                                        },
                                    });
                                }}
                                className="grid gap-4 sm:grid-cols-2"
                            >
                                <div className="sm:col-span-2"><FormErrors errors={itemForm.errors} /></div>
                                <div>
                                    <InputLabel value={t('gallery.category')} />
                                    <select className="admin-control mt-1" value={itemForm.data.gallery_category_id} onChange={(event) => itemForm.setData('gallery_category_id', event.target.value)}>
                                        <option value="">{t('gallery.uncategorized')}</option>
                                        {categories.map((category) => <option key={category.id} value={category.id}>{category.name_tr}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <InputLabel value={t('gallery.image')} />
                                    <input type="file" accept="image/*" className="mt-1 block w-full text-sm text-zinc-600 file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-100 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-zinc-800" onChange={(event) => itemForm.setData('image', event.target.files[0])} />
                                </div>
                                <TextInput placeholder={t('gallery.caption_tr')} value={itemForm.data.caption_tr} onChange={(event) => itemForm.setData('caption_tr', event.target.value)} className="w-full" />
                                <TextInput placeholder={t('gallery.caption_en')} value={itemForm.data.caption_en} onChange={(event) => itemForm.setData('caption_en', event.target.value)} className="w-full" />
                                <TextInput placeholder="Instagram URL" value={itemForm.data.instagram_url} onChange={(event) => itemForm.setData('instagram_url', event.target.value)} className="w-full" />
                                <div className="flex items-end">
                                    <Button type="submit" disabled={itemForm.processing}>{t('common.upload')}</Button>
                                </div>
                            </form>
                        </Panel>
                    )}

                    {items.length === 0 ? (
                        <Empty>{t('common.empty')}</Empty>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2">
                            {items.map((item) => (
                                <article key={item.id} className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm">
                                    <img src={item.image_url} alt={item.caption_tr || item.category_name || t('gallery.image')} className="aspect-square w-full object-cover" />
                                    <div className="p-4">
                                        <p className="text-sm font-semibold text-zinc-950">{item.category_name || t('gallery.uncategorized')}</p>
                                        <p className="mt-1 text-sm text-zinc-500">{item.caption_tr}</p>
                                        <div className="mt-3 flex gap-1">
                                            <Button type="button" variant="ghost" size="sm" onClick={() => beginEdit(item)}>{t('common.edit')}</Button>
                                            <Button type="button" variant="danger" size="sm" onClick={() => confirmDelete(t('common.confirm_delete')) && router.delete(route('gallery.items.destroy', item.id))}>{t('common.delete')}</Button>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                    <Pagination links={pagination} />
                </div>
            </div>
        </AdminLayout>
    );
}
