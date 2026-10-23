import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link } from '@inertiajs/react';
import { useTranslation } from '@/hooks/useTranslation';

export default function Show({ post }) {
    const { t } = useTranslation();

    return (
        <PublicLayout>
            <Head title={post.meta_title || post.title} />

            <article className="bg-brand-black py-12 md:py-16">
                <div className="mx-auto max-w-3xl px-4">
                    <Link href={route('blog.index')} className="text-sm font-medium text-brand-red hover:underline">
                        &larr; {t('blog_page.back')}
                    </Link>

                    {post.category && (
                        <span className="mt-6 inline-block text-xs font-medium uppercase tracking-wider text-brand-red">
                            {post.category}
                        </span>
                    )}

                    <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">{post.title}</h1>
                    <p className="mt-2 text-sm text-zinc-400">{post.published_at}</p>

                    {post.featured_image && (
                        <img src={post.featured_image} alt={post.title || t('seo.blog_title')} className="mt-8 w-full rounded-xl object-cover" />
                    )}

                    <div
                        className="prose prose-invert prose-red mt-8 max-w-none prose-headings:font-bold prose-a:text-brand-red"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </div>
            </article>
        </PublicLayout>
    );
}
