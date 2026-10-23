import AdminLayout from '@/Layouts/AdminLayout';
import FlashMessage from '@/Components/Admin/FlashMessage';
import Checkbox from '@/Components/Checkbox';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import Pagination from '@/Components/Admin/Pagination';
import { Badge, Button, Empty, FilterBar, FormErrors, PageHeader, Panel, useComposer } from '@/Components/Admin/ui';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { confirmDelete } from '@/utils/confirmDelete';

export default function Index({ facilities, pagination = [], search = '' }) {
    const { t } = useTranslation('admin');
    const [editingId, setEditingId] = useState(null);
    const form = useForm({
        name_tr: '',
        name_en: '',
        category: 'other',
        description_tr: '',
        description_en: '',
        image: null,
        sort_order: facilities.length + 1,
        is_active: true,
    });
    const composer = useComposer(form);
    const open = composer.open || editingId !== null;

    const submit = (event) => {
        event.preventDefault();
        form.transform((data) => (editingId ? { ...data, _method: 'put' } : data));
        form.post(editingId ? route('facilities.update', editingId) : route('facilities.store'), {
            forceFormData: true,
            onSuccess: () => {
                form.reset();
                setEditingId(null);
                composer.close();
            },
        });
    };

    const startEdit = (item) => {
        setEditingId(item.id);
        composer.show();
        form.clearErrors();
        form.setData({
            name_tr: item.name_tr,
            name_en: item.name_en,
            category: item.category || 'other',
            description_tr: item.description_tr || '',
            description_en: item.description_en || '',
            image: null,
            sort_order: item.sort_order,
            is_active: item.is_active,
        });
    };

    const cancel = () => {
        form.reset();
        form.clearErrors();
        setEditingId(null);
        composer.close();
    };

    return (
        <AdminLayout header={
            <PageHeader
                title={t('facilities.title')}
                description={t('dashboard.hints.facilities')}
                actions={<Button type="button" variant={open ? 'secondary' : 'primary'} onClick={open ? cancel : composer.show}>{open ? t('common.cancel') : t('common.create')}</Button>}
            />
        }>
            <Head title={t('facilities.title')} />
            <FlashMessage />

            <FilterBar onSubmit={(event) => { event.preventDefault(); router.get(route('facilities.index'), { search: event.currentTarget.search.value }); }}>
                <TextInput name="search" defaultValue={search} placeholder={t('common.search')} className="min-w-[14rem] flex-1" />
                <Button type="submit" variant="secondary">{t('common.search')}</Button>
            </FilterBar>

            {open && (
                <form onSubmit={submit} className="mt-4">
                    <Panel>
                        <h2 className="text-base font-semibold text-zinc-950">{editingId ? t('common.edit') : t('common.create')}</h2>
                        <div className="mt-4"><FormErrors errors={form.errors} /></div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <InputLabel value={t('facilities.name_tr')} />
                                <TextInput className="mt-1 w-full" value={form.data.name_tr} onChange={(event) => form.setData('name_tr', event.target.value)} />
                            </div>
                            <div>
                                <InputLabel value={t('facilities.name_en')} />
                                <TextInput className="mt-1 w-full" value={form.data.name_en} onChange={(event) => form.setData('name_en', event.target.value)} />
                            </div>
                            <div className="sm:col-span-2">
                                <InputLabel value={t('facilities.category')} />
                                <select className="admin-control mt-1" value={form.data.category} onChange={(event) => form.setData('category', event.target.value)}>
                                    {['cardio', 'strength', 'functional', 'locker', 'other'].map((category) => (
                                        <option key={category} value={category}>{t(`facilities.categories.${category}`)}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <InputLabel value={t('facilities.description_tr')} />
                                <textarea className="admin-control mt-1" rows={3} value={form.data.description_tr} onChange={(event) => form.setData('description_tr', event.target.value)} />
                            </div>
                            <div>
                                <InputLabel value={t('facilities.description_en')} />
                                <textarea className="admin-control mt-1" rows={3} value={form.data.description_en} onChange={(event) => form.setData('description_en', event.target.value)} />
                            </div>
                            <div className="sm:col-span-2">
                                <InputLabel value={t('facilities.image')} />
                                <input type="file" accept="image/*" className="mt-1 block w-full text-sm text-zinc-600 file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-100 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-zinc-800" onChange={(event) => form.setData('image', event.target.files[0])} />
                            </div>
                            <label className="flex items-center gap-2 text-sm text-zinc-700">
                                <Checkbox checked={form.data.is_active} onChange={(event) => form.setData('is_active', event.target.checked)} />
                                {t('common.active')}
                            </label>
                            <div className="flex items-center gap-2">
                                <Button type="submit" disabled={form.processing}>{editingId ? t('common.save') : t('common.create')}</Button>
                                <Button type="button" variant="secondary" onClick={cancel}>{t('common.cancel')}</Button>
                            </div>
                        </div>
                    </Panel>
                </form>
            )}

            {facilities.length === 0 ? (
                <div className="mt-4"><Empty>{t('common.empty')}</Empty></div>
            ) : (
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {facilities.map((facility) => (
                        <article key={facility.id} className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm">
                            {facility.image_url && <img src={facility.image_url} alt={facility.name_tr} className="aspect-[16/10] w-full object-cover" />}
                            <div className="p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <h2 className="font-semibold text-zinc-950">{facility.name_tr}</h2>
                                    <Badge tone={facility.is_active ? 'success' : 'neutral'}>{facility.is_active ? t('common.active') : t('common.inactive')}</Badge>
                                </div>
                                <div className="mt-3 flex gap-1">
                                    <Button type="button" variant="ghost" size="sm" onClick={() => startEdit(facility)}>{t('common.edit')}</Button>
                                    <Button type="button" variant="danger" size="sm" onClick={() => confirmDelete(t('common.confirm_delete')) && router.delete(route('facilities.destroy', facility.id))}>{t('common.delete')}</Button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
            <Pagination links={pagination} />
        </AdminLayout>
    );
}
