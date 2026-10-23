import AdminLayout from '@/Layouts/AdminLayout';
import FlashMessage from '@/Components/Admin/FlashMessage';
import InputLabel from '@/Components/InputLabel';
import Pagination from '@/Components/Admin/Pagination';
import TextInput from '@/Components/TextInput';
import { Badge, Button, buttonClass, FilterBar, FilterField, PageHeader, Panel, Toggle, tdClass, thClass } from '@/Components/Admin/ui';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { confirmDelete } from '@/utils/confirmDelete';

export default function Index({ posts, categories = [], search = '', status = '' }) {
    const { t } = useTranslation('admin');
    const blogEnabled = usePage().props.blogEnabled !== false;
    const [editingId, setEditingId] = useState(null);
    const createForm = useForm({ name_tr: '', name_en: '', sort_order: categories.length + 1 });
    const editForm = useForm({ name_tr: '', name_en: '', sort_order: 0 });

    return (
        <AdminLayout header={
            <PageHeader
                title={t('blog_posts.title')}
                description={t('dashboard.hints.blog_posts')}
                actions={<Link href={route('blog-posts.create')} className={buttonClass()}>{t('blog_posts.create')}</Link>}
            />
        }>
            <Head title={t('blog_posts.title')} />
            <FlashMessage />

            <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
                <div className="space-y-4">
                    <Panel className="flex items-center justify-between gap-4">
                        <div>
                            <p className="font-semibold text-zinc-950">{t('blog_posts.home_visibility')}</p>
                            <p className="mt-1 text-sm leading-6 text-zinc-500">{t('blog_posts.home_visibility_hint')}</p>
                        </div>
                        <Toggle
                            checked={blogEnabled}
                            label={t('blog_posts.home_visibility')}
                            onClick={() => router.put(route('blog-settings.update'), { enabled: !blogEnabled }, { preserveScroll: true })}
                        />
                    </Panel>

                    <FilterBar onSubmit={(event) => {
                        event.preventDefault();
                        router.get(route('blog-posts.index'), Object.fromEntries(new FormData(event.currentTarget)));
                    }}>
                        <FilterField label={t('common.search')}>
                            <input name="search" defaultValue={search} className="admin-control" />
                        </FilterField>
                        <FilterField label={t('common.status')}>
                            <select name="status" defaultValue={status} className="admin-control">
                                <option value="">{t('common.all')}</option>
                                <option value="published">{t('common.active')}</option>
                                <option value="draft">{t('common.inactive')}</option>
                            </select>
                        </FilterField>
                        <Button type="submit" variant="secondary">{t('common.apply')}</Button>
                    </FilterBar>

                    <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm">
                        <table className="w-full text-sm">
                            <thead className="bg-zinc-50">
                                <tr>
                                    <th className={thClass}>{t('blog_posts.list_title')}</th>
                                    <th className={thClass}>{t('blog_posts.category')}</th>
                                    <th className={thClass}>{t('common.status')}</th>
                                    <th className={thClass}>{t('common.actions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {posts.data.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-12 text-center text-sm text-zinc-500">{t('common.empty')}</td>
                                    </tr>
                                )}
                                {posts.data.map((post) => (
                                    <tr key={post.id} className="border-t border-zinc-100 hover:bg-zinc-50">
                                        <td className={`${tdClass} font-medium text-zinc-950`}>{post.title_tr}</td>
                                        <td className={tdClass}>{post.category?.name_tr || '—'}</td>
                                        <td className={tdClass}>
                                            <Badge tone={post.is_published ? 'success' : 'neutral'}>
                                                {post.is_published ? t('common.active') : t('common.inactive')}
                                            </Badge>
                                        </td>
                                        <td className={tdClass}>
                                            <Link href={route('blog-posts.edit', post.id)} className={buttonClass('ghost', 'sm')}>{t('common.edit')}</Link>
                                            <Button type="button" variant="danger" size="sm" onClick={() => confirmDelete(t('common.confirm_delete')) && router.delete(route('blog-posts.destroy', post.id))}>{t('common.delete')}</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Pagination links={posts.links} />
                </div>

                <Panel>
                    <h2 className="text-base font-semibold text-zinc-950">{t('blog_categories.title')}</h2>
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            createForm.post(route('blog-categories.store'), { onSuccess: () => createForm.reset() });
                        }}
                        className="mt-4 space-y-3"
                    >
                        <div>
                            <InputLabel value={t('blog_categories.name_tr')} />
                            <TextInput className="mt-1 w-full" value={createForm.data.name_tr} onChange={(event) => createForm.setData('name_tr', event.target.value)} />
                        </div>
                        <div>
                            <InputLabel value={t('blog_categories.name_en')} />
                            <TextInput className="mt-1 w-full" value={createForm.data.name_en} onChange={(event) => createForm.setData('name_en', event.target.value)} />
                        </div>
                        <Button type="submit" disabled={createForm.processing}>{t('blog_categories.add')}</Button>
                    </form>

                    <div className="mt-4 divide-y divide-zinc-100">
                        {categories.length === 0 && <p className="py-6 text-sm text-zinc-500">{t('common.empty')}</p>}
                        {categories.map((category) => (
                            <div key={category.id} className="py-3">
                                {editingId === category.id ? (
                                    <form onSubmit={(event) => { event.preventDefault(); editForm.put(route('blog-categories.update', category.id), { onSuccess: () => setEditingId(null) }); }} className="space-y-2">
                                        <TextInput value={editForm.data.name_tr} onChange={(event) => editForm.setData('name_tr', event.target.value)} className="w-full" />
                                        <TextInput value={editForm.data.name_en} onChange={(event) => editForm.setData('name_en', event.target.value)} className="w-full" />
                                        <div className="flex gap-2">
                                            <Button type="submit" size="sm">{t('common.save')}</Button>
                                            <Button type="button" variant="secondary" size="sm" onClick={() => setEditingId(null)}>{t('common.cancel')}</Button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="font-medium text-zinc-950">{category.name_tr}</p>
                                            <p className="text-xs text-zinc-500">{category.name_en}</p>
                                        </div>
                                        <div className="flex shrink-0">
                                            <Button type="button" variant="ghost" size="sm" onClick={() => { setEditingId(category.id); editForm.setData({ name_tr: category.name_tr, name_en: category.name_en, sort_order: category.sort_order }); }}>{t('common.edit')}</Button>
                                            <Button type="button" variant="danger" size="sm" onClick={() => confirmDelete(t('common.confirm_delete')) && router.delete(route('blog-categories.destroy', category.id))}>{t('common.delete')}</Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </Panel>
            </div>
        </AdminLayout>
    );
}
