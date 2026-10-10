import AdminLayout from '@/Layouts/AdminLayout';
import FlashMessage from '@/Components/Admin/FlashMessage';
import { Head, Link, router } from '@inertiajs/react';
import { useTranslation } from '@/hooks/useTranslation';
import { confirmDelete } from '@/utils/confirmDelete';
import Pagination from '@/Components/Admin/Pagination';

export default function Index({ posts, search = '', status = '' }) {
    const { t } = useTranslation('admin');

    return (
        <AdminLayout header={
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">{t('blog_posts.title')}</h1>
                <Link href={route('blog-posts.create')} className="rounded-lg bg-brand-red px-4 py-2 text-sm font-bold text-white">
                    {t('blog_posts.create')}
                </Link>
            </div>
        }>
            <Head title={t('blog_posts.title')} />
            <FlashMessage />
            <form className="mb-5 flex flex-wrap items-end gap-3" onSubmit={(e) => { e.preventDefault(); router.get(route('blog-posts.index'), Object.fromEntries(new FormData(e.currentTarget))); }}><label className="text-sm">{t('common.search')}<input name="search" defaultValue={search} className="mt-1 rounded border-zinc-300" /></label><label className="text-sm">{t('common.status')}<select name="status" defaultValue={status} className="mt-1 rounded border-zinc-300"><option value="">{t('common.all')}</option><option value="published">{t('common.active')}</option><option value="draft">{t('common.inactive')}</option></select></label><button className="rounded bg-brand-red px-4 py-2 text-sm font-bold text-white">{t('analytics.apply')}</button></form>

            <div className="overflow-hidden rounded-xl border bg-white">
                <table className="w-full text-sm">
                    <thead className="bg-zinc-50 text-left text-zinc-500">
                        <tr>
                            <th className="px-4 py-3">Başlık</th>
                            <th className="px-4 py-3">Kategori</th>
                            <th className="px-4 py-3">Durum</th>
                            <th className="px-4 py-3">{t('common.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.data.map((post) => (
                            <tr key={post.id} className="border-t">
                                <td className="px-4 py-3 font-medium">{post.title_tr}</td>
                                <td className="px-4 py-3">{post.category?.name_tr || '—'}</td>
                                <td className="px-4 py-3">{post.is_published ? t('common.active') : t('common.inactive')}</td>
                                <td className="px-4 py-3">
                                    <Link href={route('blog-posts.edit', post.id)} className="mr-3 text-brand-red">{t('common.edit')}</Link>
                                    <button onClick={() => confirmDelete(t('common.confirm_delete')) && router.delete(route('blog-posts.destroy', post.id))} className="text-red-600">{t('common.delete')}</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Pagination links={posts.links} />
        </AdminLayout>
    );
}
