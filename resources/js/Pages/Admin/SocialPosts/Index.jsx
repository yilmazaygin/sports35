import AdminLayout from '@/Layouts/AdminLayout';
import FlashMessage from '@/Components/Admin/FlashMessage';
import Checkbox from '@/Components/Checkbox';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Head, router, useForm } from '@inertiajs/react';
import { useTranslation } from '@/hooks/useTranslation';

export default function Index({ posts }) {
    const { t } = useTranslation('admin');
    const form = useForm({
        platform: 'instagram',
        image: null,
        post_url: '',
        caption_tr: '',
        caption_en: '',
        sort_order: posts.length + 1,
        is_active: true,
    });

    return (
        <AdminLayout header={<h1 className="text-2xl font-bold">{t('social_posts.title')}</h1>}>
            <Head title={t('social_posts.title')} />
            <FlashMessage />

            <p className="mb-6 text-sm text-zinc-500">{t('social_posts.hint')}</p>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    form.post(route('social-posts.store'), {
                        forceFormData: true,
                        onSuccess: () => form.reset('image', 'post_url', 'caption_tr', 'caption_en'),
                    });
                }}
                className="mb-8 grid gap-4 rounded-xl border bg-white p-6 sm:grid-cols-2"
            >
                <div>
                    <InputLabel value={t('social_posts.platform')} />
                    <select
                        className="mt-1 block w-full rounded-md border-zinc-300 shadow-sm"
                        value={form.data.platform}
                        onChange={(e) => form.setData('platform', e.target.value)}
                    >
                        <option value="instagram">Instagram</option>
                        <option value="facebook">Facebook</option>
                    </select>
                </div>
                <div>
                    <InputLabel value={t('social_posts.post_url')} />
                    <TextInput
                        className="mt-1 w-full"
                        value={form.data.post_url}
                        onChange={(e) => form.setData('post_url', e.target.value)}
                        placeholder="https://www.instagram.com/p/..."
                    />
                </div>
                <div>
                    <InputLabel value={t('social_posts.image')} />
                    <input
                        type="file"
                        accept="image/*"
                        className="mt-1 block w-full"
                        onChange={(e) => form.setData('image', e.target.files[0])}
                    />
                </div>
                <div>
                    <InputLabel value={t('common.active')} />
                    <label className="mt-2 flex items-center gap-2">
                        <Checkbox
                            checked={form.data.is_active}
                            onChange={(e) => form.setData('is_active', e.target.checked)}
                        />
                        <span className="text-sm">{t('social_posts.show_on_contact')}</span>
                    </label>
                </div>
                <TextInput
                    placeholder={t('social_posts.caption_tr')}
                    value={form.data.caption_tr}
                    onChange={(e) => form.setData('caption_tr', e.target.value)}
                />
                <TextInput
                    placeholder={t('social_posts.caption_en')}
                    value={form.data.caption_en}
                    onChange={(e) => form.setData('caption_en', e.target.value)}
                />
                <div className="sm:col-span-2">
                    <button type="submit" className="rounded-lg bg-brand-red px-4 py-2 text-sm font-bold text-white">
                        {t('common.create')}
                    </button>
                </div>
            </form>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                    <div key={post.id} className="overflow-hidden rounded-xl border bg-white">
                        <a href={post.post_url} target="_blank" rel="noopener noreferrer">
                            <img src={post.image_url} alt="" className="aspect-square w-full object-cover" />
                        </a>
                        <div className="p-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium uppercase text-zinc-500">{post.platform}</span>
                                <span className={`text-xs ${post.is_active ? 'text-green-600' : 'text-zinc-400'}`}>
                                    {post.is_active ? t('common.active') : t('common.inactive')}
                                </span>
                            </div>
                            {post.caption_tr && <p className="mt-2 text-sm text-zinc-600">{post.caption_tr}</p>}
                            <button
                                onClick={() => router.delete(route('social-posts.destroy', post.id))}
                                className="mt-3 text-sm text-red-600"
                            >
                                {t('common.delete')}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </AdminLayout>
    );
}
