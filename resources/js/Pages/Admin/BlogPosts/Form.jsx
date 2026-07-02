import AdminLayout from '@/Layouts/AdminLayout';
import FlashMessage from '@/Components/Admin/FlashMessage';
import RichTextEditor from '@/Components/Admin/RichTextEditor';
import Checkbox from '@/Components/Checkbox';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';
import { useTranslation } from '@/hooks/useTranslation';

export default function Form({ post, categories }) {
    const { t } = useTranslation('admin');
    const isEdit = Boolean(post);

    const { data, setData, post: submitPost, put, processing } = useForm({
        blog_category_id: post?.blog_category_id || '',
        title_tr: post?.title_tr || '',
        title_en: post?.title_en || '',
        excerpt_tr: post?.excerpt_tr || '',
        excerpt_en: post?.excerpt_en || '',
        content_tr: post?.content_tr || '',
        content_en: post?.content_en || '',
        meta_title_tr: post?.meta_title_tr || '',
        meta_title_en: post?.meta_title_en || '',
        meta_description_tr: post?.meta_description_tr || '',
        meta_description_en: post?.meta_description_en || '',
        featured_image: post?.featured_image || '',
        published_at: post?.published_at?.slice(0, 16) || '',
        is_published: post?.is_published ?? false,
    });

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('blog-posts.update', post.id));
        } else {
            submitPost(route('blog-posts.store'));
        }
    };

    return (
        <AdminLayout header={<h1 className="text-2xl font-bold">{isEdit ? t('blog_posts.edit') : t('blog_posts.create')}</h1>}>
            <Head title={isEdit ? t('blog_posts.edit') : t('blog_posts.create')} />
            <FlashMessage />

            <form onSubmit={submit} className="space-y-6 rounded-xl border bg-white p-6 shadow-sm">
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <InputLabel value={t('blog_posts.title_tr')} />
                        <TextInput className="mt-1 w-full" value={data.title_tr} onChange={(e) => setData('title_tr', e.target.value)} />
                    </div>
                    <div>
                        <InputLabel value={t('blog_posts.title_en')} />
                        <TextInput className="mt-1 w-full" value={data.title_en} onChange={(e) => setData('title_en', e.target.value)} />
                    </div>
                </div>

                <div>
                    <InputLabel value={t('blog_posts.category')} />
                    <select className="mt-1 w-full rounded-md border-zinc-300" value={data.blog_category_id}
                        onChange={(e) => setData('blog_category_id', e.target.value || null)}>
                        <option value="">—</option>
                        {categories.map((c) => <option key={c.id} value={c.id}>{c.name_tr}</option>)}
                    </select>
                </div>

                <div>
                    <InputLabel value={t('blog_posts.content_tr')} />
                    <div className="mt-1"><RichTextEditor value={data.content_tr} onChange={(v) => setData('content_tr', v)} /></div>
                </div>
                <div>
                    <InputLabel value={t('blog_posts.content_en')} />
                    <div className="mt-1"><RichTextEditor value={data.content_en} onChange={(v) => setData('content_en', v)} /></div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <InputLabel value={t('blog_posts.meta_description_tr')} />
                        <TextInput className="mt-1 w-full" value={data.meta_description_tr} onChange={(e) => setData('meta_description_tr', e.target.value)} />
                    </div>
                    <div>
                        <InputLabel value={t('blog_posts.meta_description_en')} />
                        <TextInput className="mt-1 w-full" value={data.meta_description_en} onChange={(e) => setData('meta_description_en', e.target.value)} />
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <InputLabel value={t('blog_posts.published_at')} />
                        <TextInput type="datetime-local" className="mt-1 w-full" value={data.published_at} onChange={(e) => setData('published_at', e.target.value)} />
                    </div>
                    <label className="flex items-center gap-2 pt-8">
                        <Checkbox checked={data.is_published} onChange={(e) => setData('is_published', e.target.checked)} />
                        <span className="text-sm">{t('blog_posts.published')}</span>
                    </label>
                </div>

                <button type="submit" disabled={processing} className="rounded-lg bg-brand-red px-6 py-2.5 text-sm font-bold text-white disabled:opacity-50">
                    {t('common.save')}
                </button>
            </form>
        </AdminLayout>
    );
}
