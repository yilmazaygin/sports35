import AdminLayout from '@/Layouts/AdminLayout';
import FlashMessage from '@/Components/Admin/FlashMessage';
import Checkbox from '@/Components/Checkbox';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Head, router, useForm } from '@inertiajs/react';
import { useTranslation } from '@/hooks/useTranslation';

export default function Index({ categories, items }) {
    const { t } = useTranslation('admin');

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

    return (
        <AdminLayout header={<h1 className="text-2xl font-bold">{t('gallery.title')}</h1>}>
            <Head title={t('gallery.title')} />
            <FlashMessage />

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
                        <img src={item.image_url} alt="" className="aspect-square w-full object-cover" />
                        <div className="p-3">
                            <p className="text-sm font-medium">{item.category_name}</p>
                            <p className="text-xs text-zinc-500">{item.caption_tr}</p>
                            <button onClick={() => router.delete(route('gallery.items.destroy', item.id))}
                                className="mt-2 text-sm text-red-600">{t('common.delete')}</button>
                        </div>
                    </div>
                ))}
            </div>
        </AdminLayout>
    );
}
