import AdminLayout from '@/Layouts/AdminLayout';
import FlashMessage from '@/Components/Admin/FlashMessage';
import Checkbox from '@/Components/Checkbox';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Head, router, useForm } from '@inertiajs/react';
import { useTranslation } from '@/hooks/useTranslation';
import { confirmDelete } from '@/utils/confirmDelete';
import Pagination from '@/Components/Admin/Pagination';

export default function Index({ items, pagination = [], search = '' }) {
    const { t } = useTranslation('admin');
    const form = useForm({
        name: '',
        before_image: null,
        after_image: null,
        description_tr: '',
        description_en: '',
        duration_label_tr: '',
        duration_label_en: '',
        sort_order: items.length + 1,
        is_active: true,
    });

    return (
        <AdminLayout header={<h1 className="text-2xl font-bold">{t('transformations.title')}</h1>}>
            <Head title={t('transformations.title')} />
            <FlashMessage />
            <form onSubmit={(e) => { e.preventDefault(); router.get(route('transformations.index'), { search: e.currentTarget.search.value }); }} className="mb-4 flex gap-2"><TextInput name="search" defaultValue={search} placeholder={t('common.search')} /><button className="rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white">{t('common.search')}</button></form>

            <form onSubmit={(e) => { e.preventDefault(); form.post(route('transformations.store'), { forceFormData: true, onSuccess: () => form.reset() }); }}
                className="mb-8 grid gap-4 rounded-xl border bg-white p-6 sm:grid-cols-2">
                <div className="sm:col-span-2"><InputLabel value={t('transformations.name')} />
                    <TextInput className="mt-1 w-full" value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} /></div>
                <div><InputLabel value={t('transformations.before')} />
                    <input type="file" accept="image/*" className="mt-1 block w-full" onChange={(e) => form.setData('before_image', e.target.files[0])} /></div>
                <div><InputLabel value={t('transformations.after')} />
                    <input type="file" accept="image/*" className="mt-1 block w-full" onChange={(e) => form.setData('after_image', e.target.files[0])} /></div>
                <TextInput placeholder={t('transformations.description_tr')} value={form.data.description_tr} onChange={(e) => form.setData('description_tr', e.target.value)} />
                <TextInput placeholder={t('transformations.description_en')} value={form.data.description_en} onChange={(e) => form.setData('description_en', e.target.value)} />
                <TextInput placeholder={t('transformations.duration_tr')} value={form.data.duration_label_tr} onChange={(e) => form.setData('duration_label_tr', e.target.value)} />
                <TextInput placeholder={t('transformations.duration_en')} value={form.data.duration_label_en} onChange={(e) => form.setData('duration_label_en', e.target.value)} />
                <div className="sm:col-span-2">
                    <button type="submit" className="rounded-lg bg-brand-red px-4 py-2 text-sm font-bold text-white">{t('common.create')}</button>
                </div>
            </form>

            <div className="space-y-6">
                {items.map((item) => (
                    <div key={item.id} className="flex gap-4 rounded-xl border bg-white p-4">
                        <img src={item.before_url} alt={`${t('transformations.before')}: ${item.name}`} className="h-24 w-24 rounded object-cover" />
                        <img src={item.after_url} alt={`${t('transformations.after')}: ${item.name}`} className="h-24 w-24 rounded object-cover" />
                        <div className="flex-1">
                            <p className="font-bold">{item.name}</p>
                            <p className="text-sm text-zinc-500">{item.duration_label_tr}</p>
                            <button onClick={() => confirmDelete(t('common.confirm_delete')) && router.delete(route('transformations.destroy', item.id))}
                                className="mt-2 text-sm text-red-600">{t('common.delete')}</button>
                        </div>
                    </div>
                ))}
            </div>
            <Pagination links={pagination} />
        </AdminLayout>
    );
}
