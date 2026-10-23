import { Link, usePage } from '@inertiajs/react';
import Icon from '@/Components/Admin/Icon';
import { adminGroups, isAdminNavActive } from '@/Components/Admin/navigation';
import Sports35Logo from '@/Components/Public/Sports35Logo';
import { useTranslation } from '@/hooks/useTranslation';

export default function AdminSidebar({ onNavigate, showClose = false }) {
    const { t } = useTranslation('admin');
    const { auth, publicSiteUrl } = usePage().props;
    const groups = adminGroups();
    const accountActive = route().current('profile.*');
    const initials = (auth.user?.name || '?')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase();

    return (
        <div className="flex h-full min-h-0 flex-col">
            <div className="relative flex items-center justify-center px-4 py-5">
                <Link href={route('dashboard')} onClick={onNavigate} className="block" aria-label="Sports35">
                    <Sports35Logo className="h-14 w-auto" />
                </Link>
                {showClose && (
                    <button
                        type="button"
                        onClick={onNavigate}
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-zinc-400 hover:bg-white/10 hover:text-white"
                        aria-label={t('nav.close_menu')}
                    >
                        <Icon name="close" />
                    </button>
                )}
            </div>

            <nav className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-3 pb-2" aria-label={t('nav.menu')}>
                {groups.map((group) => (
                    <div key={group.key}>
                        <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
                            {t(`nav.groups.${group.key}`)}
                        </p>
                        <div className="mt-1.5 space-y-0.5">
                            {group.items.map((item) => {
                                const active = isAdminNavActive(item.route);

                                return (
                                    <Link
                                        key={item.key}
                                        href={route(item.route)}
                                        onClick={onNavigate}
                                        aria-current={active ? 'page' : undefined}
                                        className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${active ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-400 hover:bg-white/10 hover:text-white'}`}
                                    >
                                        <Icon name={item.icon} className={`h-5 w-5 shrink-0 ${active ? 'text-brand-red' : 'text-zinc-500'}`} />
                                        <span className="truncate">{t(`nav.${item.key}`)}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            <div className="space-y-2 border-t border-white/10 p-3">
                {publicSiteUrl && (
                    <a
                        href={publicSiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-zinc-400 transition hover:bg-white/10 hover:text-white"
                    >
                        <Icon name="external" className="h-4 w-4" />
                        {t('nav.view_site')}
                    </a>
                )}
                <div className="flex items-center gap-3 px-2 py-1">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-red text-xs font-bold text-white">
                        {initials}
                    </span>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-white">{auth.user?.name}</p>
                        <p className="truncate text-xs text-zinc-500">{auth.user?.email}</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <Link
                        href={route('profile.edit')}
                        onClick={onNavigate}
                        aria-current={accountActive ? 'page' : undefined}
                        className={`rounded-xl px-3 py-2 text-center text-sm font-medium transition ${accountActive ? 'bg-white text-zinc-950' : 'text-zinc-300 hover:bg-white/10 hover:text-white'}`}
                    >
                        {t('nav.account')}
                    </Link>
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="rounded-xl px-3 py-2 text-sm font-medium text-zinc-300 transition hover:bg-white/10 hover:text-white"
                    >
                        {t('nav.logout')}
                    </Link>
                </div>
            </div>
        </div>
    );
}
