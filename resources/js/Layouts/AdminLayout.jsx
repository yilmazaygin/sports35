import { Link, usePage } from '@inertiajs/react';
import { useTranslation } from '@/hooks/useTranslation';
import AdminSidebar from '@/Components/Admin/AdminSidebar';
import Sports35Logo from '@/Components/Public/Sports35Logo';

export default function AdminLayout({ children, header }) {
    const { auth } = usePage().props;
    const { t } = useTranslation('admin');

    return (
        <div className="min-h-screen bg-zinc-100">
            <nav className="border-b border-zinc-200 bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
                    <Link href={route('dashboard')} className="flex items-center" aria-label="Sports35 Admin">
                        <span className="flex h-10 w-[150px] items-center justify-center overflow-hidden bg-zinc-950 px-2">
                            <Sports35Logo className="h-10 w-full" />
                        </span>
                        <span className="ml-3 border-l border-zinc-300 pl-3 text-sm font-semibold text-zinc-600">Admin</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <span className="hidden text-sm text-zinc-500 sm:inline">{auth.user?.name}</span>
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-brand-red"
                        >
                            {t('nav.logout')}
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="mx-auto flex max-w-7xl">
                <AdminSidebar />
                <div className="min-w-0 flex-1">
                    {header && (
                        <header className="border-b border-zinc-200 bg-white">
                            <div className="px-4 py-6 sm:px-6">{header}</div>
                        </header>
                    )}
                    <main className="px-4 py-8 sm:px-6">{children}</main>
                </div>
            </div>
        </div>
    );
}
