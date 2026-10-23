import AdminLayout from '@/Layouts/AdminLayout';
import FlashMessage from '@/Components/Admin/FlashMessage';
import RichTextEditor from '@/Components/Admin/RichTextEditor';
import TimeInput from '@/Components/Admin/TimeInput';
import Checkbox from '@/Components/Checkbox';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Button, buttonClass, FormErrors, PageHeader, Panel } from '@/Components/Admin/ui';
import { Head, Link, useForm } from '@inertiajs/react';
import { useTranslation } from '@/hooks/useTranslation';

export default function Form({ post, categories }) {
    const { t } = useTranslation('admin');
    const isEdit = Boolean(post);

    const { data, setData, post: submitPost, put, processing, errors } = useForm({
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

    const submit = (event) => {
        event.preventDefault();
        if (isEdit) {
            put(route('blog-posts.update', post.id));
        } else {
            submitPost(route('blog-posts.store'));
        }
    };

    return (
        <AdminLayout header={
            <PageHeader
                title={isEdit ? t('blog_posts.edit') : t('blog_posts.create')}
                actions={<Link href={route('blog-posts.index')} className={buttonClass('secondary')}>{t('common.back')}</Link>}
            />
        }>
            <Head title={isEdit ? t('blog_posts.edit') : t('blog_posts.create')} />
            <FlashMessage />

            <form onSubmit={submit} className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
                <div className="space-y-6">
                    <FormErrors errors={errors} />
                    <Panel className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <InputLabel value={t('blog_posts.title_tr')} />
                                <TextInput className="mt-1 w-full" value={data.title_tr} onChange={(event) => setData('title_tr', event.target.value)} />
                            </div>
                            <div>
                                <InputLabel value={t('blog_posts.title_en')} />
                                <TextInput className="mt-1 w-full" value={data.title_en} onChange={(event) => setData('title_en', event.target.value)} />
                            </div>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <InputLabel value={t('blog_posts.excerpt_tr')} />
                                <textarea className="admin-control mt-1" rows={3} value={data.excerpt_tr} onChange={(event) => setData('excerpt_tr', event.target.value)} />
                            </div>
                            <div>
                                <InputLabel value={t('blog_posts.excerpt_en')} />
                                <textarea className="admin-control mt-1" rows={3} value={data.excerpt_en} onChange={(event) => setData('excerpt_en', event.target.value)} />
                            </div>
                        </div>
                        <div>
                            <InputLabel value={t('blog_posts.content_tr')} />
                            <div className="mt-1"><RichTextEditor value={data.content_tr} onChange={(value) => setData('content_tr', value)} /></div>
                        </div>
                        <div>
                            <InputLabel value={t('blog_posts.content_en')} />
                            <div className="mt-1"><RichTextEditor value={data.content_en} onChange={(value) => setData('content_en', value)} /></div>
                        </div>
                    </Panel>
                </div>

                <div className="space-y-4 lg:sticky lg:top-6">
                    <Panel className="space-y-4">
                        <div>
                            <InputLabel value={t('blog_posts.category')} />
                            <select className="admin-control mt-1" value={data.blog_category_id} onChange={(event) => setData('blog_category_id', event.target.value || null)}>
                                <option value="">—</option>
                                {categories.map((category) => <option key={category.id} value={category.id}>{category.name_tr}</option>)}
                            </select>
                        </div>
                        <div>
                            <InputLabel htmlFor="published-on" value={t('blog_posts.published_at')} />
                            <TextInput
                                id="published-on"
                                type="date"
                                className="mt-1 w-full"
                                value={data.published_at.slice(0, 10)}
                                onChange={(event) => {
                                    const date = event.target.value;
                                    const time = data.published_at.length >= 16 ? data.published_at.slice(11, 16) : '';
                                    setData('published_at', date ? (time ? `${date}T${time}` : date) : '');
                                }}
                            />
                            <TimeInput
                                clearable
                                label={t('blog_posts.published_at')}
                                className="mt-2"
                                disabled={data.published_at.slice(0, 10) === ''}
                                value={data.published_at.length >= 16 ? data.published_at.slice(11, 16) : ''}
                                onChange={(time) => {
                                    const date = data.published_at.slice(0, 10);
                                    setData('published_at', date ? (time ? `${date}T${time}` : date) : '');
                                }}
                            />
                        </div>
                        <label className="flex items-center gap-2 text-sm text-zinc-700">
                            <Checkbox checked={data.is_published} onChange={(event) => setData('is_published', event.target.checked)} />
                            {t('blog_posts.published')}
                        </label>
                        <Button type="submit" disabled={processing} className="w-full">{t('common.save')}</Button>
                    </Panel>
                    <Panel className="space-y-4">
                        <div>
                            <InputLabel value={t('blog_posts.meta_title_tr')} />
                            <TextInput className="mt-1 w-full" value={data.meta_title_tr} onChange={(event) => setData('meta_title_tr', event.target.value)} />
                        </div>
                        <div>
                            <InputLabel value={t('blog_posts.meta_title_en')} />
                            <TextInput className="mt-1 w-full" value={data.meta_title_en} onChange={(event) => setData('meta_title_en', event.target.value)} />
                        </div>
                        <div>
                            <InputLabel value={t('blog_posts.featured_image')} />
                            <TextInput className="mt-1 w-full" value={data.featured_image} onChange={(event) => setData('featured_image', event.target.value)} />
                        </div>
                        <div>
                            <InputLabel value={t('blog_posts.meta_description_tr')} />
                            <TextInput className="mt-1 w-full" value={data.meta_description_tr} onChange={(event) => setData('meta_description_tr', event.target.value)} />
                        </div>
                        <div>
                            <InputLabel value={t('blog_posts.meta_description_en')} />
                            <TextInput className="mt-1 w-full" value={data.meta_description_en} onChange={(event) => setData('meta_description_en', event.target.value)} />
                        </div>
                    </Panel>
                </div>
            </form>
        </AdminLayout>
    );
}
