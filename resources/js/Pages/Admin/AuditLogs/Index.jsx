import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Pagination from '@/Components/Admin/Pagination';
import { Button, FilterBar, FilterField, PageHeader } from '@/Components/Admin/ui';
import { useTranslation } from '@/hooks/useTranslation';

export default function Index({ logs, users, filters, actions }) {
    const { t } = useTranslation('admin');

    const submit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        router.get(route('audit-logs.index'), Object.fromEntries(data), { preserveState: true });
    };

    return (
        <AdminLayout header={<PageHeader title={t('audit.title')} description={t('dashboard.hints.audit_logs')} />}>
            <Head title={t('audit.title')} />
            <FilterBar onSubmit={submit}>
                <FilterField label={t('audit.from')}>
                    <input name="from" type="date" defaultValue={filters.from ?? ''} className="admin-control" />
                </FilterField>
                <FilterField label={t('audit.to')}>
                    <input name="to" type="date" defaultValue={filters.to ?? ''} className="admin-control" />
                </FilterField>
                <FilterField label={t('audit.admin')}>
                    <select name="user_id" defaultValue={filters.user_id ?? ''} className="admin-control">
                        <option value="">{t('audit.all_admins')}</option>
                        {users.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}
                    </select>
                </FilterField>
                <FilterField label={t('audit.action')}>
                    <select name="action" defaultValue={filters.action ?? ''} className="admin-control">
                        <option value="">{t('audit.all_actions')}</option>
                        {actions.map((action) => <option key={action}>{action}</option>)}
                    </select>
                </FilterField>
                <FilterField label={t('audit.entity')}>
                    <input name="entity" defaultValue={filters.entity ?? ''} className="admin-control" />
                </FilterField>
                <Button type="submit" variant="secondary">{t('common.search')}</Button>
            </FilterBar>

            <div className="mt-4 overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-zinc-50 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                            <tr>
                                <th className="px-4 py-3">{t('audit.date')}</th>
                                <th className="px-4 py-3">{t('audit.admin')}</th>
                                <th className="px-4 py-3">{t('audit.action')}</th>
                                <th className="px-4 py-3">{t('audit.entity')}</th>
                                <th className="px-4 py-3">{t('audit.changes')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.data.map((log) => (
                                <tr key={log.id} className="border-t border-zinc-100 align-top hover:bg-zinc-50">
                                    <td className="px-4 py-3 whitespace-nowrap text-zinc-700">{log.created_at}</td>
                                    <td className="px-4 py-3">{log.user ?? '—'}</td>
                                    <td className="px-4 py-3">{log.action}</td>
                                    <td className="px-4 py-3">{log.entity} #{log.entity_id ?? '—'}</td>
                                    <td className="px-4 py-3 text-xs leading-5 text-zinc-500">{Object.entries(log.changes ?? {}).map(([key, value]) => `${key}: ${String(value)}`).join(', ') || '—'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {logs.data.length === 0 && <p className="px-4 py-12 text-center text-sm text-zinc-500">{t('common.empty')}</p>}
            </div>
            <Pagination links={logs.links} />
        </AdminLayout>
    );
}
