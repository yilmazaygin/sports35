import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useTranslation } from '@/hooks/useTranslation';

const modules = [
    { key: 'leads', route: 'leads.index' },
    { key: 'analytics', route: 'analytics.index' },
    { key: 'testimonials', route: 'testimonials.index' },
    { key: 'working_hours', route: 'working-hours.edit' },
    { key: 'membership_packages', route: 'membership-packages.index' },
    { key: 'campaigns', route: 'campaigns.index' },
    { key: 'special_days', route: 'special-days.index' },
    { key: 'gallery', route: 'gallery.index' },
    { key: 'transformations', route: 'transformations.index' },
    { key: 'facilities', route: 'facilities.index' },
    { key: 'trainers', route: 'trainers.index' },
    { key: 'group_classes', route: 'group-classes.index' },
    { key: 'blog_posts', route: 'blog-posts.index' },
    { key: 'media', route: 'media.index' },
    { key: 'settings', route: 'site-settings.edit' },
];

export default function Dashboard({ newLeadCount = 0, awaitingContactCount = 0, recentLeads = [], activeCampaignCount = 0, contentWarnings = [] }) {
    const { auth } = usePage().props;
    const { t } = useTranslation('admin');

    return (
        <AdminLayout header={
            <div>
                <h1 className="text-2xl font-bold text-zinc-900">{t('dashboard.title')}</h1>
                <p className="mt-1 text-sm text-zinc-500">{t('dashboard.welcome', { name: auth.user?.name })}</p>
            </div>
        }>
            <Head title={t('dashboard.title')} />

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {modules.map((mod) => (
                    <Link key={mod.key} href={route(mod.route)}
                        className="group rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:border-brand-red/40 hover:shadow-md">
                        <div className="mb-4 h-1 w-12 rounded bg-brand-red" />
                        <div className="flex items-center justify-between gap-3">
                            <h3 className="font-semibold text-zinc-900 group-hover:text-brand-red">{t(`nav.${mod.key}`)}</h3>
                            {mod.key === 'leads' && newLeadCount > 0 && (
                                <span className="rounded-full bg-brand-red px-2 py-0.5 text-xs font-bold text-white">{newLeadCount}</span>
                            )}
                        </div>
                        <p className="mt-2 text-sm text-zinc-500">{t('dashboard.subtitle')}</p>
                    </Link>
                ))}
            </div>
            <div className="mt-8 grid gap-6 lg:grid-cols-2"><section className="rounded-xl border border-zinc-200 bg-white p-6"><h2 className="font-bold">{t('dashboard.attention')}</h2><div className="mt-4 grid gap-3 sm:grid-cols-3"><Metric label={t('dashboard.new_leads')} value={newLeadCount} /><Metric label={t('dashboard.awaiting_contact')} value={awaitingContactCount} /><Metric label={t('dashboard.active_campaigns')} value={activeCampaignCount} /></div>{contentWarnings.length > 0 && <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800"><strong>{t('dashboard.content_warnings')}</strong><ul className="mt-2 list-disc pl-5">{contentWarnings.map((warning) => <li key={warning}>{warning}</li>)}</ul></div>}</section><section className="rounded-xl border border-zinc-200 bg-white p-6"><h2 className="font-bold">{t('dashboard.recent_leads')}</h2><div className="mt-4 space-y-3">{recentLeads.map((lead) => <Link key={lead.id} href={route('leads.show', lead.id)} className="flex items-center justify-between border-b border-zinc-100 pb-2 text-sm"><span>{lead.first_name} {lead.last_name}</span><span className="text-zinc-500">{t(`leads.statuses.${lead.status}`)}</span></Link>)}{recentLeads.length === 0 && <p className="text-sm text-zinc-500">{t('leads.empty')}</p>}</div></section></div>
        </AdminLayout>
    );
}

function Metric({ label, value }) { return <div className="rounded-lg bg-zinc-50 p-3"><p className="text-xs text-zinc-500">{label}</p><p className="mt-1 text-2xl font-black">{value}</p></div>; }
