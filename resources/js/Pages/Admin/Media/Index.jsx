import AdminLayout from '@/Layouts/AdminLayout';
import FlashMessage from '@/Components/Admin/FlashMessage';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import Pagination from '@/Components/Admin/Pagination';
import { Badge, Button, FilterBar, FilterField, FormErrors, PageHeader, Panel, useComposer } from '@/Components/Admin/ui';
import { Head, router, useForm } from '@inertiajs/react';
import { useTranslation } from '@/hooks/useTranslation';
import { confirmDelete } from '@/utils/confirmDelete';
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
    const composer = useComposer(form);

    const beginEdit = (file) => {
        setEditingFile(file);
        editForm.setData({ collection: file.collection || '', alt_tr: file.alt_tr || '', alt_en: file.alt_en || '' });
    };
    const cancelEdit = () => {
        setEditingFile(null);
        editForm.reset();
        editForm.clearErrors();
    };

    return (
        <AdminLayout header={
            <PageHeader
                title={t('media.title')}
                description={t('media.subtitle')}
                actions={(
                    <Button type="button" variant={composer.open ? 'secondary' : 'primary'} onClick={composer.toggle}>
                        {composer.open ? t('common.cancel') : t('media.upload')}
                    </Button>
                )}
            />
        }>
            <Head title={t('media.title')} />
            <FlashMessage />

            <FilterBar onSubmit={(event) => { event.preventDefault(); router.get(route('media.index'), Object.fromEntries(new FormData(event.currentTarget))); }}>
                <FilterField label={t('common.search')}>
                    <input name="search" defaultValue={search} className="admin-control" />
                </FilterField>
                <FilterField label={t('media.type')}>
                    <input name="mime" defaultValue={mime} placeholder="image/" className="admin-control" />
                </FilterField>
                <Button type="submit" variant="secondary">{t('common.apply')}</Button>
            </FilterBar>

            {composer.open && (
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        form.post(route('media.store'), {
                            forceFormData: true,
                            onSuccess: () => {
                                form.reset();
                                composer.close();
                            },
                        });
                    }}
                    className="mt-4"
                >
                    <Panel>
                        <h2 className="text-base font-semibold text-zinc-950">{t('media.upload')}</h2>
                        <div className="mt-4"><FormErrors errors={form.errors} /></div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <InputLabel value={t('media.file')} />
                                <input type="file" className="mt-1 block w-full text-sm text-zinc-600 file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-100 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-zinc-800" onChange={(event) => form.setData('file', event.target.files[0])} />
                            </div>
                            <div>
                                <InputLabel value={t('media.collection')} />
                                <select className="admin-control mt-1" value={form.data.collection} onChange={(event) => form.setData('collection', event.target.value)}>
                                    {collections.map((collection) => <option key={collection} value={collection}>{collection}</option>)}
                                </select>
                            </div>
                            <div>
                                <InputLabel value={t('media.alt_tr')} />
                                <TextInput className="mt-1 w-full" value={form.data.alt_tr} onChange={(event) => form.setData('alt_tr', event.target.value)} />
                            </div>
                            <div>
                                <InputLabel value={t('media.alt_en')} />
                                <TextInput className="mt-1 w-full" value={form.data.alt_en} onChange={(event) => form.setData('alt_en', event.target.value)} />
                            </div>
                        </div>
                        <div className="mt-4">
                            <Button type="submit" disabled={form.processing}>{t('common.upload')}</Button>
                        </div>
                    </Panel>
                </form>
            )}

            {editingFile && (
                <Panel className="mt-4">
                    <div className="mb-4 flex items-center justify-between gap-4">
                        <h2 className="text-base font-semibold text-zinc-950">{t('media.edit')}</h2>
                        <Button type="button" variant="ghost" size="sm" onClick={cancelEdit}>{t('common.cancel')}</Button>
                    </div>
                    <form onSubmit={(event) => { event.preventDefault(); editForm.put(route('media.update', editingFile.id), { onSuccess: cancelEdit }); }} className="grid gap-4 sm:grid-cols-3">
                        <div className="sm:col-span-3"><FormErrors errors={editForm.errors} /></div>
                        <div>
                            <InputLabel value={t('media.collection')} />
                            <select className="admin-control mt-1" value={editForm.data.collection} onChange={(event) => editForm.setData('collection', event.target.value)}>
                                {collections.map((collection) => <option key={collection} value={collection}>{collection}</option>)}
                            </select>
                        </div>
                        <div>
                            <InputLabel value={t('media.alt_tr')} />
                            <TextInput className="mt-1 w-full" value={editForm.data.alt_tr} onChange={(event) => editForm.setData('alt_tr', event.target.value)} />
                        </div>
                        <div>
                            <InputLabel value={t('media.alt_en')} />
                            <TextInput className="mt-1 w-full" value={editForm.data.alt_en} onChange={(event) => editForm.setData('alt_en', event.target.value)} />
                        </div>
                        <div className="flex gap-2 sm:col-span-3">
                            <Button type="submit" disabled={editForm.processing}>{t('common.save')}</Button>
                            <Button type="button" variant="secondary" onClick={cancelEdit}>{t('common.cancel')}</Button>
                        </div>
                    </form>
                </Panel>
            )}

            {files.data.length === 0 ? (
                <div className="mt-4"><EmptyNote label={t('common.empty')} /></div>
            ) : (
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {files.data.map((file) => (
                        <article key={file.id} className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm">
                            {file.mime_type?.startsWith('image/') ? (
                                <img src={file.url} alt={file.alt_tr || file.original_name} className="h-40 w-full object-cover" />
                            ) : (
                                <div className="flex h-40 items-center justify-center bg-zinc-100 px-4 text-center text-sm text-zinc-400">{file.mime_type}</div>
                            )}
                            <div className="p-4">
                                <p className="truncate text-sm font-semibold text-zinc-950">{file.original_name}</p>
                                <p className="mt-1 text-xs text-zinc-500">{file.collection} — {(file.size / 1024).toFixed(0)} KB</p>
                                <div className="mt-3 flex flex-wrap items-center gap-1">
                                    <Button type="button" variant="ghost" size="sm" onClick={() => beginEdit(file)}>{t('common.edit')}</Button>
                                    {file.referenced ? (
                                        <Badge tone="warning">{t('media.in_use')}</Badge>
                                    ) : (
                                        <Button type="button" variant="danger" size="sm" onClick={() => confirmDelete(t('common.confirm_delete')) && router.delete(route('media.destroy', file.id))}>{t('common.delete')}</Button>
                                    )}
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
            <Pagination links={files.links} />
        </AdminLayout>
    );
}

function EmptyNote({ label }) {
    return <p className="rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-14 text-center text-sm text-zinc-500">{label}</p>;
}
