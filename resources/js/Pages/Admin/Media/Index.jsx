import AdminLayout from '@/Layouts/AdminLayout';
import FlashMessage from '@/Components/Admin/FlashMessage';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Head, router, useForm } from '@inertiajs/react';
import { useTranslation } from '@/hooks/useTranslation';

export default function Index({ files, collections }) {
    const { t } = useTranslation('admin');
    const form = useForm({
        file: null,
        collection: 'general',
        alt_tr: '',
        alt_en: '',
    });

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
                </div>
                <button type="submit" disabled={form.processing} className="mt-4 rounded-lg bg-brand-red px-4 py-2 text-sm font-bold text-white">
                    {t('common.upload')}
                </button>
            </form>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {files.map((file) => (
                    <div key={file.id} className="overflow-hidden rounded-xl border bg-white shadow-sm">
                        {file.mime_type?.startsWith('image/') ? (
                            <img src={file.url} alt={file.alt_tr || file.original_name} className="h-40 w-full object-cover" />
                        ) : (
                            <div className="flex h-40 items-center justify-center bg-zinc-100 text-zinc-400">{file.mime_type}</div>
                        )}
                        <div className="p-3">
                            <p className="truncate text-sm font-medium">{file.original_name}</p>
                            <p className="text-xs text-zinc-500">{file.collection} — {(file.size / 1024).toFixed(0)} KB</p>
                            <button onClick={() => router.delete(route('media.destroy', file.id))} className="mt-2 text-sm text-red-600">{t('common.delete')}</button>
                        </div>
                    </div>
                ))}
            </div>
        </AdminLayout>
    );
}
