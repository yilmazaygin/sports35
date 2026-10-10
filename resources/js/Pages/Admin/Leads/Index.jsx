import AdminLayout from '@/Layouts/AdminLayout';
import FlashMessage from '@/Components/Admin/FlashMessage';
import { Head, Link, router } from '@inertiajs/react';
import { useTranslation } from '@/hooks/useTranslation';
import Pagination from '@/Components/Admin/Pagination';

export default function Index({ leads, status, statuses, search = '', source = '', sort = 'newest' }) {
    const { t } = useTranslation('admin');
    return <AdminLayout header={<div><h1 className="text-2xl font-bold text-zinc-900">{t('leads.title')}</h1><p className="mt-1 text-sm text-zinc-500">{t('leads.subtitle')}</p></div>}>
        <Head title={t('leads.title')} /><FlashMessage />
        <form className="mb-6 flex flex-wrap items-end gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm" onSubmit={(e) => { e.preventDefault(); router.get(route('leads.index'), Object.fromEntries(new FormData(e.currentTarget)), { preserveState: true, replace: true }); }}>
            <label className="text-sm">{t('common.search')}<input name="search" defaultValue={search} className="mt-1 block rounded-lg border-zinc-300 text-sm" /></label>
            <label className="text-sm">{t('leads.source')}<input name="source" defaultValue={source} className="mt-1 block rounded-lg border-zinc-300 text-sm" /></label>
            <label className="text-sm font-medium text-zinc-700">{t('leads.filter_status')}<select name="status" defaultValue={status || ''} className="mt-1 block rounded-lg border-zinc-300 text-sm">
                <option value="">{t('leads.all_statuses')}</option>{statuses.map((item) => <option key={item} value={item}>{t(`leads.statuses.${item}`)}</option>)}
            </select></label><label className="text-sm">{t('leads.sort')}<select name="sort" defaultValue={sort} className="mt-1 block rounded-lg border-zinc-300 text-sm"><option value="newest">{t('leads.newest')}</option><option value="oldest">{t('leads.oldest')}</option></select></label><button className="rounded-lg bg-brand-red px-4 py-2 text-sm font-bold text-white">{t('analytics.apply')}</button>
        </form>
        <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm"><table className="w-full text-left text-sm"><thead className="bg-zinc-50 text-zinc-500"><tr><th className="px-4 py-3">{t('leads.name')}</th><th className="px-4 py-3">{t('leads.contact')}</th><th className="px-4 py-3">{t('leads.status')}</th><th className="px-4 py-3">{t('leads.source')}</th><th className="px-4 py-3">{t('leads.created')}</th></tr></thead><tbody>
            {leads.data.map((lead) => <tr key={lead.id} className="border-t border-zinc-100"><td className="px-4 py-3"><Link href={route('leads.show', lead.id)} className="font-medium text-brand-red hover:underline">{lead.first_name} {lead.last_name}</Link></td><td className="px-4 py-3">{lead.phone}<br /><span className="text-zinc-500">{lead.email}</span></td><td className="px-4 py-3">{t(`leads.statuses.${lead.status}`)}</td><td className="px-4 py-3 text-zinc-500">{lead.utm_source || lead.source || '—'}</td><td className="px-4 py-3 text-zinc-500">{new Date(lead.created_at).toLocaleString()}</td></tr>)}
            {leads.data.length === 0 && <tr><td colSpan="5" className="px-4 py-8 text-center text-zinc-500">{t('leads.empty')}</td></tr>}
        </tbody></table></div>
        <Pagination links={leads.links} />
    </AdminLayout>;
}
