import AdminLayout from '@/Layouts/AdminLayout';
import FlashMessage from '@/Components/Admin/FlashMessage';
import Icon from '@/Components/Admin/Icon';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Badge, Button, Empty, FormErrors, PageHeader, Panel, useComposer } from '@/Components/Admin/ui';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { confirmDelete } from '@/utils/confirmDelete';

const emptyCampaign = {
    title_tr: '', title_en: '', body_tr: '', body_en: '',
    icon: null, remove_icon: false, starts_on: '', ends_on: '',
};

export default function Index({ campaigns, pastCampaigns = [] }) {
    const { t } = useTranslation('admin');
    const [editingId, setEditingId] = useState(null);
    const createForm = useForm({ ...emptyCampaign });
    const editForm = useForm({ ...emptyCampaign });
    const composer = useComposer(createForm);

    const startEdit = (campaign) => {
        setEditingId(campaign.id);
        editForm.setData({
            title_tr: campaign.title_tr,
            title_en: campaign.title_en,
            body_tr: campaign.body_tr,
            body_en: campaign.body_en,
            icon: null,
            remove_icon: false,
            starts_on: campaign.starts_on,
            ends_on: campaign.ends_on,
        });
    };

    return (
        <AdminLayout header={
            <PageHeader
                title={t('campaigns.title')}
                description={t('campaigns.subtitle')}
                actions={(
                    <Button type="button" variant={composer.open ? 'secondary' : 'primary'} onClick={composer.toggle}>
                        {composer.open ? t('common.cancel') : t('campaigns.add')}
                    </Button>
                )}
            />
        }>
            <Head title={t('campaigns.title')} />
            <FlashMessage />

            {composer.open && (
                <Panel className="mb-6">
                    <h2 className="mb-4 text-base font-semibold text-zinc-950">{t('campaigns.add')}</h2>
                    <CampaignForm
                        form={createForm}
                        t={t}
                        submitLabel={t('common.create')}
                        onSubmit={() => submitCampaign(createForm, route('campaigns.store'), 'post', () => {
                            createForm.reset();
                            composer.close();
                        })}
                    />
                </Panel>
            )}

            {campaigns.length === 0 ? (
                <Empty>{t('common.empty')}</Empty>
            ) : (
                <div className="space-y-3">
                    {campaigns.map((campaign) => (
                        <CampaignCard
                            key={campaign.id}
                            campaign={campaign}
                            editing={editingId === campaign.id}
                            editForm={editForm}
                            t={t}
                            onEdit={() => startEdit(campaign)}
                            onCancel={() => setEditingId(null)}
                            onSaved={() => setEditingId(null)}
                        />
                    ))}
                </div>
            )}

            {pastCampaigns.length > 0 && (
                <details className="group mt-8 rounded-2xl border border-zinc-200/80 bg-white shadow-sm">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 [&::-webkit-details-marker]:hidden">
                        <span className="font-semibold text-zinc-950">
                            {t('campaigns.past')}
                            <span className="ml-2 text-sm font-medium text-zinc-500">{pastCampaigns.length}</span>
                        </span>
                        <Icon name="chevron" className="h-4 w-4 text-zinc-400 transition group-open:rotate-180" />
                    </summary>
                    <div className="space-y-3 border-t border-zinc-100 p-4">
                        <p className="px-1 text-sm text-zinc-500">{t('campaigns.past_hint')}</p>
                        {pastCampaigns.map((campaign) => (
                            <CampaignCard
                                key={campaign.id}
                                campaign={campaign}
                                past
                                editing={editingId === campaign.id}
                                editForm={editForm}
                                t={t}
                                onEdit={() => startEdit(campaign)}
                                onCancel={() => setEditingId(null)}
                                onSaved={() => setEditingId(null)}
                            />
                        ))}
                    </div>
                </details>
            )}
        </AdminLayout>
    );
}

function submitCampaign(form, url, method, onSuccess) {
    form.transform((data) => {
        const next = { ...data };
        if (!(next.icon instanceof File)) {
            delete next.icon;
        }
        return next;
    });

    const options = { forceFormData: true, preserveScroll: true, onSuccess };
    if (method === 'post') {
        form.post(url, options);
        return;
    }
    form.put(url, options);
}

function CampaignCard({ campaign, past = false, editing, editForm, t, onEdit, onCancel, onSaved }) {
    const tone = past ? 'neutral' : (campaign.scheduled ? 'warning' : 'success');
    const label = past ? t('common.inactive') : (campaign.scheduled ? t('campaigns.scheduled') : t('common.active'));

    return (
        <Panel>
            {editing ? (
                <CampaignForm
                    form={editForm}
                    t={t}
                    currentIcon={campaign.icon_url}
                    submitLabel={t('common.save')}
                    onSubmit={() => submitCampaign(editForm, route('campaigns.update', campaign.id), 'put', onSaved)}
                    extra={<Button type="button" variant="secondary" onClick={onCancel}>{t('common.cancel')}</Button>}
                />
            ) : (
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex min-w-0 gap-4">
                        {campaign.icon_url && <img src={campaign.icon_url} alt="" className="h-12 w-12 shrink-0 rounded-full object-cover" />}
                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <h3 className="font-semibold text-zinc-950">{campaign.title_tr}</h3>
                                <Badge tone={tone}>{label}</Badge>
                            </div>
                            <p className="text-sm text-zinc-500">{campaign.title_en}</p>
                            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-600">{campaign.body_tr}</p>
                            <p className="mt-2 text-sm text-zinc-400">{campaign.starts_on} — {campaign.ends_on}</p>
                        </div>
                    </div>
                    <div className="flex shrink-0 gap-1">
                        <Button type="button" variant="ghost" size="sm" onClick={onEdit}>{t('common.edit')}</Button>
                        <Button type="button" variant="danger" size="sm" onClick={() => confirmDelete(t('common.confirm_delete')) && router.delete(route('campaigns.destroy', campaign.id))}>{t('common.delete')}</Button>
                    </div>
                </div>
            )}
        </Panel>
    );
}

function CampaignForm({ form, t, onSubmit, extra, currentIcon = null, submitLabel }) {
    return (
        <form onSubmit={(event) => { event.preventDefault(); onSubmit(); }}>
            <FormErrors errors={form.errors} />
            <div className="grid gap-4 sm:grid-cols-2">
            <div>
                <InputLabel value={t('campaigns.title_tr')} />
                <TextInput className="mt-1 w-full" value={form.data.title_tr} onChange={(event) => form.setData('title_tr', event.target.value)} />
            </div>
            <div>
                <InputLabel value={t('campaigns.title_en')} />
                <TextInput className="mt-1 w-full" value={form.data.title_en} onChange={(event) => form.setData('title_en', event.target.value)} />
            </div>
            <div>
                <InputLabel value={t('campaigns.body_tr')} />
                <textarea rows={5} className="admin-control mt-1" value={form.data.body_tr} onChange={(event) => form.setData('body_tr', event.target.value)} />
            </div>
            <div>
                <InputLabel value={t('campaigns.body_en')} />
                <textarea rows={5} className="admin-control mt-1" value={form.data.body_en} onChange={(event) => form.setData('body_en', event.target.value)} />
            </div>
            <div className="sm:col-span-2">
                <InputLabel value={t('campaigns.icon')} />
                <input type="file" accept="image/*" className="mt-1 block w-full text-sm text-zinc-600 file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-100 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-zinc-800" onChange={(event) => form.setData('icon', event.target.files?.[0] ?? null)} />
                <p className="mt-1 text-sm text-zinc-500">{t('campaigns.icon_hint')}</p>
                {currentIcon && !form.data.remove_icon && (
                    <label className="mt-3 flex items-center gap-3 text-sm text-zinc-700">
                        <img src={currentIcon} alt="" className="h-10 w-10 rounded-full object-cover" />
                        <span className="flex items-center gap-2">
                            <input type="checkbox" checked={form.data.remove_icon} onChange={(event) => form.setData('remove_icon', event.target.checked)} />
                            {t('campaigns.remove_icon')}
                        </span>
                    </label>
                )}
            </div>
            <div>
                <InputLabel value={t('campaigns.starts_on')} />
                <TextInput type="date" className="mt-1 w-full" value={form.data.starts_on} onChange={(event) => form.setData('starts_on', event.target.value)} />
            </div>
            <div>
                <InputLabel value={t('campaigns.ends_on')} />
                <TextInput type="date" className="mt-1 w-full" value={form.data.ends_on} onChange={(event) => form.setData('ends_on', event.target.value)} />
            </div>
            <div className="flex flex-wrap gap-2 sm:col-span-2">
                <Button type="submit" disabled={form.processing}>{submitLabel}</Button>
                {extra}
            </div>
            </div>
        </form>
    );
}
