import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link } from '@inertiajs/react';
import { useTranslation } from '@/hooks/useTranslation';

export default function Index({ posts }) {
    const { t } = useTranslation();

    return (
        <PublicLayout>
            <Head title={t('seo.blog_title')} />

            <section className="bg-brand-black py-12 md:py-16">
                <div className="mx-auto max-w-6xl px-4">
                    <div className="mb-12 text-center">
                        <h1 className="text-3xl font-black uppercase text-white sm:text-4xl">{t('blog_page.title')}</h1>
                        <p className="mt-3 text-zinc-400">{t('blog_page.subtitle')}</p>
                    </div>

                    {posts.length === 0 ? (
                        <p className="text-center text-zinc-400">{t('blog_page.empty')}</p>
                    ) : (
                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {posts.map((post) => (
                                <article
                                    key={post.slug}
                                    className="group overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 transition hover:border-brand-red/30"
                                >
                                    {post.featured_image && (
                                        <img src={post.featured_image} alt={post.title || t('seo.blog_title')} className="aspect-video w-full object-cover" />
                                    )}
                                    <div className="p-5">
                                        {post.category && (
                                            <span className="text-xs font-medium uppercase tracking-wider text-brand-red">
                                                {post.category}
                                            </span>
                                        )}
                                        <h2 className="mt-2 text-lg font-bold text-white group-hover:text-brand-red">
                                            <Link href={route('blog.show', post.slug)}>{post.title}</Link>
                                        </h2>
                                        {post.excerpt && (
                                            <p className="mt-2 line-clamp-3 text-sm text-zinc-400">{post.excerpt}</p>
                                        )}
                                        <div className="mt-4 flex items-center justify-between">
                                            <span className="text-xs text-zinc-400">{post.published_at}</span>
                                            <Link
                                                href={route('blog.show', post.slug)}
                                                className="text-sm font-medium text-brand-red hover:underline"
                                            >
                                                {t('blog_page.read_more')}
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
