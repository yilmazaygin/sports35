import AdminLayout from '@/Layouts/AdminLayout';
import FlashMessage from '@/Components/Admin/FlashMessage';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Head, router, useForm } from '@inertiajs/react';
import { useTranslation } from '@/hooks/useTranslation';
import { confirmDelete } from '@/utils/confirmDelete';
import Pagination from '@/Components/Admin/Pagination';
import { useState } from 'react';

export default function Index({ files, collections, search = '', mime = '' }) {
    const { t } = useTranslation('admin');
    const [editingFile, setEditingFile] = useState(null);
    const form = useForm({
        file: null,
        collection: 'general',
        alt_tr: '',
        alt_en: '',
    });
    const editForm = useForm({ collection: '', alt_tr: '', alt_en: '' });

    const beginEdit = (file) => {
        setEditingFile(file);
        editForm.setData({ collection: file.collection || '', alt_tr: file.alt_tr || '', alt_en: file.alt_en || '' });
    };
    const cancelEdit = () => {
        setEditingFile(null);
        editForm.reset();
        editForm.clearErrors();
    };

    const submit = (e) => {
        e.preventDefault();
        form.post(route('media.store'), {
            forceFormData: true,
            onSuccess: () => form.reset(),
        });
    };

    return (
        <AdminLayout header={
            <div>
                <h1 className="text-2xl font-bold">{t('media.title')}</h1>
                <p className="mt-1 text-sm text-zinc-500">{t('media.subtitle')}</p>
            </div>
        }>
            <Head title={t('media.title')} />
            <FlashMessage />
            <form className="mb-5 flex flex-wrap items-end gap-3" onSubmit={(e) => { e.preventDefault(); router.get(route('media.index'), Object.fromEntries(new FormData(e.currentTarget))); }}><label className="text-sm">{t('common.search')}<input name="search" defaultValue={search} className="mt-1 rounded border-zinc-300" /></label><label className="text-sm">{t('media.type')}<input name="mime" defaultValue={mime} placeholder="image/" className="mt-1 rounded border-zinc-300" /></label><button className="rounded bg-brand-red px-4 py-2 text-sm font-bold text-white">{t('analytics.apply')}</button></form>

            <form onSubmit={submit} className="mb-8 rounded-xl border bg-white p-6 shadow-sm">
                <h2 className="mb-4 font-semibold">{t('media.upload')}</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                        <InputLabel value={t('media.file')} />
                        <input type="file" className="mt-1 block w-full text-sm" onChange={(e) => form.setData('file', e.target.files[0])} />
                    </div>
                    <div>
                        <InputLabel value={t('media.collection')} />
                        <select className="mt-1 w-full rounded-md border-zinc-300" value={form.data.collection}
                            onChange={(e) => form.setData('collection', e.target.value)}>
                            {collections.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <InputLabel value={t('media.alt_tr')} />
                        <TextInput className="mt-1 w-full" value={form.data.alt_tr} onChange={(e) => form.setData('alt_tr', e.target.value)} />
                    </div>
                    <div>
                        <InputLabel value={t('media.alt_en')} />
                        <TextInput className="mt-1 w-full" value={form.data.alt_en} onChange={(e) => form.setData('alt_en', e.target.value)} />
                    </div>
                </div>
                <button type="submit" disabled={form.processing} className="mt-4 rounded-lg bg-brand-red px-4 py-2 text-sm font-bold text-white">
                    {t('common.upload')}
                </button>
            </form>

            {editingFile && (
                <div className="mb-8 rounded-xl border border-brand-red/30 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between gap-4">
                        <h2 className="font-semibold">{t('media.edit')}</h2>
                        <button type="button" onClick={cancelEdit} className="text-sm text-zinc-600 hover:text-zinc-900">{t('common.cancel')}</button>
                    </div>
                    <form onSubmit={(e) => { e.preventDefault(); editForm.put(route('media.update', editingFile.id), { onSuccess: cancelEdit }); }} className="grid gap-4 sm:grid-cols-3">
                        <div>
                            <InputLabel value={t('media.collection')} />
                            <select className="mt-1 w-full rounded-md border-zinc-300" value={editForm.data.collection} onChange={(e) => editForm.setData('collection', e.target.value)}>
                                {collections.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <InputLabel value={t('media.alt_tr')} />
                            <TextInput className="mt-1 w-full" value={editForm.data.alt_tr} onChange={(e) => editForm.setData('alt_tr', e.target.value)} />
                        </div>
                        <div>
                            <InputLabel value={t('media.alt_en')} />
                            <TextInput className="mt-1 w-full" value={editForm.data.alt_en} onChange={(e) => editForm.setData('alt_en', e.target.value)} />
                        </div>
                        <div className="flex gap-3 sm:col-span-3">
                            <button type="submit" disabled={editForm.processing} className="rounded-lg bg-brand-red px-4 py-2 text-sm font-bold text-white">{t('common.save')}</button>
                            <button type="button" onClick={cancelEdit} className="rounded-lg border px-4 py-2 text-sm">{t('common.cancel')}</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {files.data.map((file) => (
                    <div key={file.id} className="overflow-hidden rounded-xl border bg-white shadow-sm">
                        {file.mime_type?.startsWith('image/') ? (
                            <img src={file.url} alt={file.alt_tr || file.original_name} className="h-40 w-full object-cover" />
                        ) : (
                            <div className="flex h-40 items-center justify-center bg-zinc-100 text-zinc-400">{file.mime_type}</div>
                        )}
                        <div className="p-3">
                            <p className="truncate text-sm font-medium">{file.original_name}</p>
                            <p className="text-xs text-zinc-500">{file.collection} — {(file.size / 1024).toFixed(0)} KB</p>
                            <button onClick={() => beginEdit(file)} className="mt-2 mr-3 text-sm font-medium text-brand-red hover:underline">{t('common.edit')}</button>
                            {file.referenced ? <p className="mt-2 text-xs font-medium text-amber-700">{t('media.in_use')}</p> : <button onClick={() => confirmDelete(t('common.confirm_delete')) && router.delete(route('media.destroy', file.id))} className="mt-2 text-sm text-red-600">{t('common.delete')}</button>}
                        </div>
                    </div>
                ))}
            </div>
            <Pagination links={files.links} />
        </AdminLayout>
    );
}
