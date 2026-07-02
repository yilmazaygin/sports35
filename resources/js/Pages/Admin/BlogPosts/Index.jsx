import AdminLayout from '@/Layouts/AdminLayout';
import FlashMessage from '@/Components/Admin/FlashMessage';
import { Head, Link, router } from '@inertiajs/react';
import { useTranslation } from '@/hooks/useTranslation';

export default function Index({ posts }) {
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
                        {posts.map((post) => (
                            <tr key={post.id} className="border-t">
                                <td className="px-4 py-3 font-medium">{post.title_tr}</td>
                                <td className="px-4 py-3">{post.category?.name_tr || '—'}</td>
                                <td className="px-4 py-3">{post.is_published ? t('common.active') : t('common.inactive')}</td>
                                <td className="px-4 py-3">
                                    <Link href={route('blog-posts.edit', post.id)} className="mr-3 text-brand-red">{t('common.edit')}</Link>
                                    <button onClick={() => router.delete(route('blog-posts.destroy', post.id))} className="text-red-600">{t('common.delete')}</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
