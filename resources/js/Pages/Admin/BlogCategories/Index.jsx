import AdminLayout from '@/Layouts/AdminLayout';
import FlashMessage from '@/Components/Admin/FlashMessage';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

export default function Index({ categories }) {
    const { t } = useTranslation('admin');
    const [editingId, setEditingId] = useState(null);
    const createForm = useForm({ name_tr: '', name_en: '', sort_order: categories.length + 1 });
    const editForm = useForm({ name_tr: '', name_en: '', sort_order: 0 });

    return (
        <AdminLayout header={<h1 className="text-2xl font-bold">{t('blog_categories.title')}</h1>}>
            <Head title={t('blog_categories.title')} />
            <FlashMessage />

            <form onSubmit={(e) => { e.preventDefault(); createForm.post(route('blog-categories.store'), { onSuccess: () => createForm.reset() }); }}
                className="mb-8 grid gap-4 rounded-xl border bg-white p-6 sm:grid-cols-3">
                <div><InputLabel value={t('blog_categories.name_tr')} /><TextInput className="mt-1 w-full" value={createForm.data.name_tr} onChange={(e) => createForm.setData('name_tr', e.target.value)} /></div>
                <div><InputLabel value={t('blog_categories.name_en')} /><TextInput className="mt-1 w-full" value={createForm.data.name_en} onChange={(e) => createForm.setData('name_en', e.target.value)} /></div>
                <div className="flex items-end"><button type="submit" className="rounded-lg bg-brand-red px-4 py-2 text-sm font-bold text-white">{t('blog_categories.add')}</button></div>
            </form>

            <div className="rounded-xl border bg-white">
                {categories.map((cat) => (
                    <div key={cat.id} className="flex items-center justify-between border-b px-4 py-3 last:border-0">
                        {editingId === cat.id ? (
                            <form onSubmit={(e) => { e.preventDefault(); editForm.put(route('blog-categories.update', cat.id), { onSuccess: () => setEditingId(null) }); }} className="flex flex-1 gap-3">
                                <TextInput value={editForm.data.name_tr} onChange={(e) => editForm.setData('name_tr', e.target.value)} />
                                <TextInput value={editForm.data.name_en} onChange={(e) => editForm.setData('name_en', e.target.value)} />
                                <button type="submit" className="text-brand-red">{t('common.save')}</button>
                            </form>
                        ) : (
                            <>
                                <span>{cat.name_tr} / {cat.name_en}</span>
                                <div>
                                    <button onClick={() => { setEditingId(cat.id); editForm.setData(cat); }} className="mr-3 text-brand-red">{t('common.edit')}</button>
                                    <button onClick={() => router.delete(route('blog-categories.destroy', cat.id))} className="text-red-600">{t('common.delete')}</button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </AdminLayout>
    );
}
