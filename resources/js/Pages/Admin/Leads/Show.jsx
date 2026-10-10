import AdminLayout from '@/Layouts/AdminLayout';
import FlashMessage from '@/Components/Admin/FlashMessage';
import { Head, Link, useForm } from '@inertiajs/react';
import { useTranslation } from '@/hooks/useTranslation';

export default function Show({ lead, statuses }) {
    const { t } = useTranslation('admin');
    const form = useForm({ status: lead.status, note: lead.note || '' });
    return <AdminLayout header={<div><h1 className="text-2xl font-bold text-zinc-900">{lead.first_name} {lead.last_name}</h1><p className="mt-1 text-sm text-zinc-500">{t('leads.detail')}</p></div>}>
        <Head title={`${lead.first_name} ${lead.last_name}`} /><FlashMessage />
        <div className="grid gap-6 lg:grid-cols-3">
            <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm lg:col-span-2"><h2 className="mb-4 font-semibold">{t('leads.contact')}</h2><dl className="grid gap-4 sm:grid-cols-2"><Info label={t('leads.phone')} value={lead.phone} /><Info label={t('leads.email')} value={lead.email} /><Info label={t('leads.interested_service')} value={lead.interested_service || t('leads.not_provided')} /><Info label={t('leads.source')} value={lead.source} /></dl><div className="mt-5"><h3 className="text-sm font-medium text-zinc-500">{t('leads.note')}</h3><p className="mt-1 whitespace-pre-wrap text-zinc-800">{lead.note || t('leads.not_provided')}</p></div></section>
            <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"><h2 className="mb-4 font-semibold">{t('leads.consent')}</h2><p className="text-sm text-zinc-700">{t('leads.marketing')}: <strong>{lead.marketing_opt_in ? t('common.yes') : t('common.no')}</strong></p>{lead.marketing_opt_in_at && <p className="mt-1 text-xs text-zinc-500">{new Date(lead.marketing_opt_in_at).toLocaleString()}</p>}<div className="mt-4 space-y-3 text-xs text-zinc-500">{lead.consents.map((consent) => <div key={consent.id} className="border-t border-zinc-100 pt-2">{consent.consent_type}: {consent.granted ? t('common.yes') : t('common.no')}<br />{new Date(consent.given_at).toLocaleString()}</div>)}</div></section>
            <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm lg:col-span-3"><form onSubmit={(e) => { e.preventDefault(); form.put(route('leads.update', lead.id)); }} className="grid gap-4 sm:grid-cols-2"><div><label className="text-sm font-medium text-zinc-700">{t('leads.status')}</label><select value={form.data.status} onChange={(e) => form.setData('status', e.target.value)} className="mt-1 w-full rounded-lg border-zinc-300">{statuses.map((item) => <option key={item} value={item}>{t(`leads.statuses.${item}`)}</option>)}</select></div><div><label className="text-sm font-medium text-zinc-700">{t('leads.note')}</label><textarea value={form.data.note} onChange={(e) => form.setData('note', e.target.value)} rows={3} className="mt-1 w-full rounded-lg border-zinc-300" /></div><div className="flex gap-3"><button disabled={form.processing} className="rounded-lg bg-brand-red px-4 py-2 text-sm font-bold text-white">{t('common.save')}</button><Link href={route('leads.index')} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm">{t('leads.back')}</Link></div></form></section>
        </div>
    </AdminLayout>;
}

function Info({ label, value }) { return <div><dt className="text-xs uppercase tracking-wide text-zinc-500">{label}</dt><dd className="mt-1 text-zinc-900">{value}</dd></div>; }
