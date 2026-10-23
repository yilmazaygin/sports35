import AdminLayout from '@/Layouts/AdminLayout';
import Icon from '@/Components/Admin/Icon';
import { adminGroups } from '@/Components/Admin/navigation';
import { PageHeader, Panel } from '@/Components/Admin/ui';
import { Head, Link, usePage } from '@inertiajs/react';
import { useTranslation } from '@/hooks/useTranslation';

export default function Dashboard({ contentWarnings = [] }) {
    const { auth } = usePage().props;
    const { t } = useTranslation('admin');
    const groups = adminGroups().filter((group) => group.key !== 'overview');

    return (
        <AdminLayout header={
            <PageHeader
                title={t('dashboard.welcome', { name: auth.user?.name })}
                description={t('dashboard.lead')}
            />
        }>
            <Head title={t('dashboard.title')} />

            {contentWarnings.length > 0 && (
                <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-950">
                    <p className="font-semibold">{t('dashboard.content_warnings')}</p>
                    <ul className="mt-2 space-y-1">
                        {contentWarnings.map((warning) => <li key={warning}>{warning}</li>)}
                    </ul>
                </div>
            )}

            <div className="space-y-8">
                {groups.map((group) => (
                    <section key={group.key}>
                        <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">{t(`nav.groups.${group.key}`)}</h2>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                            {group.items.map((item) => (
                                <Link key={item.key} href={route(item.route)} className="group">
                                    <Panel className="flex h-full items-start gap-4 transition group-hover:border-brand-red/30">
                                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-brand-red">
                                            <Icon name={item.icon} />
                                        </span>
                                        <span>
                                            <span className="block font-semibold text-zinc-950 group-hover:text-brand-red">{t(`nav.${item.key}`)}</span>
                                            <span className="mt-1 block text-sm leading-6 text-zinc-500">{t(`dashboard.hints.${item.key}`)}</span>
                                        </span>
                                    </Panel>
                                </Link>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </AdminLayout>
    );
}
