import AdminLayout from '@/Layouts/AdminLayout';
import FlashMessage from '@/Components/Admin/FlashMessage';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import BrandIcon from '@/Components/Public/BrandIcon';
import WhyUsIcon, { whyUsIconNames } from '@/Components/Public/WhyUsIcon';
import { Head, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Button, FormErrors, PageHeader, Panel } from '@/Components/Admin/ui';

export default function Edit({ settings }) {
    const { t } = useTranslation('admin');
    const [section, setSection] = useState('contact');
    const { data, setData, put, processing, errors } = useForm({
        ...settings,
        social_accounts: settings.social_accounts ?? [],
    });
    const sections = [
        ['contact', t('site_settings.contact')],
        ['social', t('site_settings.social')],
        ['why_us', t('site_settings.why_us')],
        ['other', t('site_settings.other')],
    ];

    useEffect(() => {
        const keys = Object.keys(errors);
        if (!keys.length) {
            return;
        }
        if (keys.some((key) => key.startsWith('why_us'))) {
            setSection('why_us');
        } else if (keys.some((key) => key.startsWith('social_accounts'))) {
            setSection('social');
        } else if (keys.includes('video_audio')) {
            setSection('other');
        } else {
            setSection('contact');
        }
    }, [errors]);

    const updateAccount = (index, field, value) => {
        setData('social_accounts', data.social_accounts.map((account, itemIndex) => (
            itemIndex === index ? { ...account, [field]: value } : account
        )));
    };

    return (
        <AdminLayout header={<PageHeader title={t('site_settings.title')} description={t('site_settings.subtitle')} />}>
            <Head title={t('site_settings.title')} />
            <FlashMessage />

            <form onSubmit={(event) => { event.preventDefault(); put(route('site-settings.update')); }} className="space-y-4">
                <FormErrors errors={errors} />
                <div className="flex gap-1 overflow-x-auto rounded-2xl bg-white p-1 shadow-sm ring-1 ring-zinc-200">
                    {sections.map(([id, label]) => (
                        <button
                            key={id}
                            type="button"
                            onClick={() => setSection(id)}
                            aria-current={section === id ? 'page' : undefined}
                            className={`rounded-xl px-4 py-2 text-sm font-semibold whitespace-nowrap ${section === id ? 'bg-zinc-950 text-white' : 'text-zinc-600 hover:bg-zinc-100'}`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
                <Panel>
                <section className={`space-y-4 ${section === 'contact' ? '' : 'hidden'}`}>
                    <h2 className="text-lg font-semibold text-zinc-900">{t('site_settings.contact')}</h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <InputLabel value={t('site_settings.phone')} />
                            <TextInput className="mt-1 w-full" value={data.phone} onChange={(event) => setData('phone', event.target.value)} />
                        </div>
                        <div>
                            <InputLabel value={t('site_settings.whatsapp')} />
                            <TextInput className="mt-1 w-full" value={data.whatsapp} onChange={(event) => setData('whatsapp', event.target.value)} />
                        </div>
                        <div className="sm:col-span-2">
                            <InputLabel value={t('site_settings.email')} />
                            <TextInput type="email" className="mt-1 w-full" value={data.email} onChange={(event) => setData('email', event.target.value)} />
                        </div>
                        <div>
                            <InputLabel value={t('site_settings.address_tr')} />
                            <TextInput className="mt-1 w-full" value={data.address_tr} onChange={(event) => setData('address_tr', event.target.value)} />
                        </div>
                        <div>
                            <InputLabel value={t('site_settings.address_en')} />
                            <TextInput className="mt-1 w-full" value={data.address_en} onChange={(event) => setData('address_en', event.target.value)} />
                        </div>
                        <div className="sm:col-span-2">
                            <InputLabel value={t('site_settings.maps_url')} />
                            <TextInput type="url" className="mt-1 w-full" value={data.maps_url ?? ''} onChange={(event) => setData('maps_url', event.target.value)} />
                            <p className="mt-2 text-sm text-zinc-500">{t('site_settings.maps_url_hint')}</p>
                        </div>
                        <div className="sm:col-span-2">
                            <InputLabel value={t('site_settings.maps_embed')} />
                            <TextInput className="mt-1 w-full" value={data.maps_embed} onChange={(event) => setData('maps_embed', event.target.value)} />
                            <p className="mt-2 text-sm text-zinc-500">{t('site_settings.maps_hint')}</p>
                        </div>
                    </div>
                </section>

                <section className={`space-y-4 ${section === 'social' ? '' : 'hidden'}`}>
                    <div>
                        <h2 className="text-lg font-semibold text-zinc-900">{t('site_settings.social')}</h2>
                        <p className="mt-1 text-sm text-zinc-500">{t('site_settings.social_hint')}</p>
                    </div>
                    <div className="space-y-3">
                        {data.social_accounts.map((account, index) => (
                            <label key={account.platform} className="grid gap-3 sm:grid-cols-[200px_1fr] sm:items-center">
                                <span className="flex items-center gap-3 text-sm font-medium text-zinc-800">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-900">
                                        <BrandIcon name={account.platform} />
                                    </span>
                                    {t(`site_settings.platforms.${account.platform}`)}
                                </span>
                                <TextInput
                                    type="url"
                                    className="w-full"
                                    placeholder="https://"
                                    value={account.url}
                                    onChange={(event) => updateAccount(index, 'url', event.target.value)}
                                />
                            </label>
                        ))}
                    </div>
                </section>

                <section className={`space-y-4 ${section === 'why_us' ? '' : 'hidden'}`}>
                    <div>
                        <h2 className="text-lg font-semibold text-zinc-900">{t('site_settings.why_us')}</h2>
                        <p className="mt-1 text-sm text-zinc-500">{t('site_settings.why_us_hint')}</p>
                    </div>
                    <div className="grid gap-4 lg:grid-cols-2">
                        {data.why_us.items.map((item, index) => (
                            <div key={index} className="space-y-3 rounded-lg border border-zinc-200 p-4">
                                <div className="flex items-center gap-3">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-red/10 text-brand-red">
                                        <WhyUsIcon name={item.icon} />
                                    </span>
                                    <h3 className="font-medium text-zinc-900">{t('site_settings.why_us_card', { number: index + 1 })}</h3>
                                </div>
                                <div>
                                    <InputLabel value={t('site_settings.why_us_icon')} />
                                    <select
                                        className="admin-control mt-1"
                                        value={item.icon}
                                        onChange={(event) => {
                                            const items = data.why_us.items.map((entry, itemIndex) => itemIndex === index ? { ...entry, icon: event.target.value } : entry);
                                            setData('why_us', { ...data.why_us, items });
                                        }}
                                    >
                                        {whyUsIconNames.map((icon) => <option key={icon} value={icon}>{t(`site_settings.why_us_icons.${icon}`)}</option>)}
                                    </select>
                                </div>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div>
                                        <InputLabel value={t('site_settings.why_us_title_tr')} />
                                        <TextInput className="mt-1 w-full" value={item.title_tr} onChange={(event) => {
                                            const items = data.why_us.items.map((entry, itemIndex) => itemIndex === index ? { ...entry, title_tr: event.target.value } : entry);
                                            setData('why_us', { ...data.why_us, items });
                                        }} />
                                    </div>
                                    <div>
                                        <InputLabel value={t('site_settings.why_us_title_en')} />
                                        <TextInput className="mt-1 w-full" value={item.title_en} onChange={(event) => {
                                            const items = data.why_us.items.map((entry, itemIndex) => itemIndex === index ? { ...entry, title_en: event.target.value } : entry);
                                            setData('why_us', { ...data.why_us, items });
                                        }} />
                                    </div>
                                    <div>
                                        <InputLabel value={t('site_settings.why_us_body_tr')} />
                                        <textarea rows={3} className="admin-control mt-1" value={item.body_tr} onChange={(event) => {
                                            const items = data.why_us.items.map((entry, itemIndex) => itemIndex === index ? { ...entry, body_tr: event.target.value } : entry);
                                            setData('why_us', { ...data.why_us, items });
                                        }} />
                                    </div>
                                    <div>
                                        <InputLabel value={t('site_settings.why_us_body_en')} />
                                        <textarea rows={3} className="admin-control mt-1" value={item.body_en} onChange={(event) => {
                                            const items = data.why_us.items.map((entry, itemIndex) => itemIndex === index ? { ...entry, body_en: event.target.value } : entry);
                                            setData('why_us', { ...data.why_us, items });
                                        }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div>
                        <InputLabel value={t('site_settings.why_us_paragraph_tr')} />
                        <textarea rows={4} className="admin-control mt-1" value={data.why_us.paragraph_tr} onChange={(event) => setData('why_us', { ...data.why_us, paragraph_tr: event.target.value })} />
                    </div>
                    <div>
                        <InputLabel value={t('site_settings.why_us_paragraph_en')} />
                        <textarea rows={4} className="admin-control mt-1" value={data.why_us.paragraph_en} onChange={(event) => setData('why_us', { ...data.why_us, paragraph_en: event.target.value })} />
                    </div>
                </section>

                <section className={`space-y-4 ${section === 'other' ? '' : 'hidden'}`}>
                    <h2 className="text-lg font-semibold text-zinc-900">{t('site_settings.other')}</h2>
                    <div className="rounded-lg border border-zinc-200 p-4">
                        <label className="flex items-center gap-3 text-sm font-medium text-zinc-800">
                            <input
                                type="checkbox"
                                className="rounded border-zinc-300 text-brand-red focus:ring-brand-red"
                                checked={Boolean(data.video_audio)}
                                onChange={(event) => setData('video_audio', event.target.checked)}
                            />
                            {t('site_settings.video_audio')}
                        </label>
                        <p className="mt-2 text-sm text-zinc-500">{t('site_settings.video_audio_hint')}</p>
                    </div>
                </section>

                <div className="sticky bottom-4 z-10 flex justify-end">
                    <Button type="submit" disabled={processing} className="shadow-lg">{t('common.save')}</Button>
                </div>
                </Panel>
            </form>
        </AdminLayout>
    );
}
