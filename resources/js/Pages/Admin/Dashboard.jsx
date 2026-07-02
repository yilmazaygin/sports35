import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useTranslation } from '@/hooks/useTranslation';

const modules = [
    { key: 'working_hours', route: 'working-hours.edit' },
    { key: 'membership_packages', route: 'membership-packages.index' },
    { key: 'campaigns', route: 'campaigns.index' },
    { key: 'special_days', route: 'special-days.index' },
    { key: 'gallery', route: 'gallery.index' },
    { key: 'transformations', route: 'transformations.index' },
    { key: 'blog_posts', route: 'blog-posts.index' },
    { key: 'media', route: 'media.index' },
    { key: 'settings', route: 'site-settings.edit' },
];

export default function Dashboard() {
    const { auth } = usePage().props;
    const { t } = useTranslation('admin');

    return (
        <AdminLayout header={
            <div>
                <h1 className="text-2xl font-bold text-zinc-900">{t('dashboard.title')}</h1>
                <p className="mt-1 text-sm text-zinc-500">{t('dashboard.welcome', { name: auth.user?.name })}</p>
            </div>
        }>
            <Head title={t('dashboard.title')} />

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {modules.map((mod) => (
                    <Link key={mod.key} href={route(mod.route)}
                        className="group rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:border-brand-red/40 hover:shadow-md">
                        <div className="mb-4 h-1 w-12 rounded bg-brand-red" />
                        <h3 className="font-semibold text-zinc-900 group-hover:text-brand-red">{t(`nav.${mod.key}`)}</h3>
                        <p className="mt-2 text-sm text-zinc-500">{t('dashboard.subtitle')}</p>
                    </Link>
                ))}
            </div>
        </AdminLayout>
    );
}
