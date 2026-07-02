import { Link } from '@inertiajs/react';
import { useTranslation } from '@/hooks/useTranslation';

const navItems = [
    { key: 'dashboard', route: 'dashboard' },
    { key: 'working_hours', route: 'working-hours.edit' },
    { key: 'membership_packages', route: 'membership-packages.index' },
    { key: 'campaigns', route: 'campaigns.index' },
    { key: 'special_days', route: 'special-days.index' },
    { key: 'blog_posts', route: 'blog-posts.index' },
    { key: 'blog_categories', route: 'blog-categories.index' },
    { key: 'gallery', route: 'gallery.index' },
    { key: 'transformations', route: 'transformations.index' },
    { key: 'social_posts', route: 'social-posts.index' },
    { key: 'media', route: 'media.index' },
    { key: 'settings', route: 'site-settings.edit' },
];

export default function AdminSidebar() {
    const { t } = useTranslation('admin');

    return (
        <aside className="hidden w-56 shrink-0 border-r border-zinc-200 bg-white lg:block">
            <nav className="space-y-1 p-4">
                {navItems.map((item) => (
                    <Link
                        key={item.key}
                        href={route(item.route)}
                        className="block rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50 hover:text-brand-red"
                    >
                        {t(`nav.${item.key}`)}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}
