import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import Icon from '@/Components/Admin/Icon';
import AdminSidebar from '@/Components/Admin/AdminSidebar';
import Sports35Logo from '@/Components/Public/Sports35Logo';
import { useTranslation } from '@/hooks/useTranslation';

export default function AdminLayout({ children, header }) {
    const { t } = useTranslation('admin');
    const { url } = usePage();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setOpen(false);
    }, [url]);

    useEffect(() => {
        if (!open) {
            return undefined;
        }

        const onKey = (event) => {
            if (event.key === 'Escape') {
                setOpen(false);
            }
        };

        const previous = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', onKey);

        return () => {
            document.body.style.overflow = previous;
            window.removeEventListener('keydown', onKey);
        };
    }, [open]);

    return (
        <div className="min-h-screen bg-zinc-100 text-zinc-900">
            <a
                href="#admin-main"
                className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2"
            >
                {t('nav.skip')}
            </a>

            <aside className="fixed inset-y-0 left-0 z-30 hidden h-dvh w-64 bg-brand-black lg:block">
                <AdminSidebar />
            </aside>

            {open && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <button
                        type="button"
                        className="absolute inset-0 bg-black/55"
                        aria-label={t('nav.close_menu')}
                        onClick={() => setOpen(false)}
                    />
                    <aside className="relative flex h-dvh w-72 max-w-[85vw] flex-col bg-brand-black shadow-2xl">
                        <AdminSidebar showClose onNavigate={() => setOpen(false)} />
                    </aside>
                </div>
            )}

            <div className="lg:pl-64">
                <div className="sticky top-0 z-20 flex items-center gap-3 border-b border-zinc-200 bg-zinc-100/95 px-4 py-3 backdrop-blur lg:hidden">
                    <button
                        type="button"
                        onClick={() => setOpen(true)}
                        className="rounded-lg border border-zinc-300 bg-white p-2 text-zinc-800"
                        aria-label={t('nav.menu')}
                    >
                        <Icon name="menu" />
                    </button>
                    <Link href={route('dashboard')} className="flex h-9 w-28 items-center overflow-hidden rounded-md bg-brand-black px-1" aria-label="Sports35">
                        <Sports35Logo className="h-9 w-full" />
                    </Link>
                </div>

                <main id="admin-main" tabIndex={-1} className="mx-auto w-full max-w-7xl px-4 py-6 outline-none sm:px-6 lg:px-8 lg:py-8">
                    {header && <div className="mb-6">{header}</div>}
                    {children}
                </main>
            </div>
        </div>
    );
}
