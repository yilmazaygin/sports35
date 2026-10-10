import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Pagination from '@/Components/Admin/Pagination';
import { useTranslation } from '@/hooks/useTranslation';

export default function Index({ logs, users, filters, actions }) {
    const { t } = useTranslation('admin');
    const submit = (event) => { event.preventDefault(); const data = new FormData(event.currentTarget); router.get(route('audit-logs.index'), Object.fromEntries(data), { preserveState: true }); };
    return <AdminLayout header={<h1 className="text-2xl font-bold text-zinc-900">{t('audit.title')}</h1>}>
        <Head title={t('audit.title')} />
        <form onSubmit={submit} className="mb-6 grid gap-3 rounded-xl bg-white p-4 shadow-sm md:grid-cols-6">
            <input name="from" type="date" defaultValue={filters.from ?? ''} className="rounded-lg border-zinc-300" />
            <input name="to" type="date" defaultValue={filters.to ?? ''} className="rounded-lg border-zinc-300" />
            <select name="user_id" defaultValue={filters.user_id ?? ''} className="rounded-lg border-zinc-300"><option value="">{t('audit.all_admins')}</option>{users.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}</select>
            <select name="action" defaultValue={filters.action ?? ''} className="rounded-lg border-zinc-300"><option value="">{t('audit.all_actions')}</option>{actions.map((action) => <option key={action}>{action}</option>)}</select>
            <input name="entity" defaultValue={filters.entity ?? ''} placeholder={t('audit.entity')} className="rounded-lg border-zinc-300" />
            <button className="rounded-lg bg-zinc-900 px-4 py-2 font-medium text-white">{t('common.search')}</button>
        </form>
        <div className="overflow-hidden rounded-xl bg-white shadow-sm"><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-zinc-50 text-zinc-500"><tr><th className="p-4">{t('audit.date')}</th><th className="p-4">{t('audit.admin')}</th><th className="p-4">{t('audit.action')}</th><th className="p-4">{t('audit.entity')}</th><th className="p-4">{t('audit.changes')}</th></tr></thead><tbody>{logs.data.map((log) => <tr key={log.id} className="border-t border-zinc-100"><td className="p-4">{log.created_at}</td><td className="p-4">{log.user ?? '—'}</td><td className="p-4">{log.action}</td><td className="p-4">{log.entity} #{log.entity_id ?? '—'}</td><td className="p-4 text-xs text-zinc-500">{Object.entries(log.changes ?? {}).map(([key, value]) => `${key}: ${String(value)}`).join(', ') || '—'}</td></tr>)}</tbody></table></div>{logs.data.length === 0 && <p className="p-8 text-center text-zinc-500">{t('common.empty')}</p>}</div>
        <Pagination links={logs.links} />
    </AdminLayout>;
}
