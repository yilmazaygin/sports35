import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { useTranslation } from '@/hooks/useTranslation';

export default function Index({ from, to, eventCounts, leadsByStatus, leadsBySource, leadCount, conversionRate }) {
    const { t } = useTranslation('admin');
    const filter = (key) => (eventCounts?.[key] || 0);
    return <AdminLayout header={<div><h1 className="text-2xl font-bold text-zinc-900">{t('analytics.title')}</h1><p className="mt-1 text-sm text-zinc-500">{t('analytics.subtitle')}</p></div>}>
        <Head title={t('analytics.title')} />
        <form className="mb-6 flex flex-wrap items-end gap-3 rounded-xl border border-zinc-200 bg-white p-4" onSubmit={(e) => { e.preventDefault(); router.get(route('analytics.index'), Object.fromEntries(new FormData(e.currentTarget))); }}><label className="text-sm">{t('analytics.from')}<input name="from" type="date" defaultValue={from} className="mt-1 block rounded-md border-zinc-300" /></label><label className="text-sm">{t('analytics.to')}<input name="to" type="date" defaultValue={to} className="mt-1 block rounded-md border-zinc-300" /></label><button className="rounded-lg bg-brand-red px-4 py-2 text-sm font-bold text-white">{t('analytics.apply')}</button></form>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[['leadCount', leadCount, 'analytics.leads'], ['free_trial_form_submitted', filter('free_trial_form_submitted'), 'analytics.submissions'], ['free_trial_cta_click', filter('free_trial_cta_click'), 'analytics.cta_clicks'], ['conversionRate', conversionRate === null ? '—' : `${conversionRate}%`, 'analytics.conversion']].map(([key, value, label]) => <div key={key} className="rounded-xl border border-zinc-200 bg-white p-5"><p className="text-sm text-zinc-500">{t(label)}</p><p className="mt-2 text-3xl font-black text-zinc-900">{value}</p></div>)}</div>
        <div className="mt-6 grid gap-6 lg:grid-cols-3"><Summary title={t('analytics.by_status')} values={leadsByStatus} translate={(key) => t(`leads.statuses.${key}`)} /><Summary title={t('analytics.by_source')} values={leadsBySource} /><Summary title={t('analytics.events')} values={eventCounts} translate={(key) => t(`analytics.events_list.${key}`)} /></div>
    </AdminLayout>;
}

function Summary({ title, values = {}, translate = (value) => value }) {
    return <section className="rounded-xl border border-zinc-200 bg-white p-5"><h2 className="font-bold text-zinc-900">{title}</h2><div className="mt-4 space-y-2">{Object.entries(values).map(([key, value]) => <div key={key} className="flex justify-between border-b border-zinc-100 pb-2 text-sm"><span className="text-zinc-600">{translate(key)}</span><strong>{value}</strong></div>)}{!Object.keys(values).length && <p className="text-sm text-zinc-500">—</p>}</div></section>;
}
