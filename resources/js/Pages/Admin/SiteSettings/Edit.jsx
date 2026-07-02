import AdminLayout from '@/Layouts/AdminLayout';
import FlashMessage from '@/Components/Admin/FlashMessage';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';
import { useTranslation } from '@/hooks/useTranslation';

export default function Edit({ settings }) {
    const { t } = useTranslation('admin');
    const { data, setData, put, processing } = useForm({ ...settings });

    return (
        <AdminLayout header={<h1 className="text-2xl font-bold">{t('site_settings.title')}</h1>}>
            <Head title={t('site_settings.title')} />
            <FlashMessage />

            <form onSubmit={(e) => { e.preventDefault(); put(route('site-settings.update')); }}
                className="space-y-6 rounded-xl border bg-white p-6 shadow-sm">
                <div className="grid gap-4 sm:grid-cols-2">
                    <div><InputLabel value={t('site_settings.phone')} />
                        <TextInput className="mt-1 w-full" value={data['contact.phone']} onChange={(e) => setData('contact.phone', e.target.value)} /></div>
                    <div><InputLabel value={t('site_settings.whatsapp')} />
                        <TextInput className="mt-1 w-full" value={data['contact.whatsapp']} onChange={(e) => setData('contact.whatsapp', e.target.value)} /></div>
                    <div className="sm:col-span-2"><InputLabel value={t('site_settings.email')} />
                        <TextInput type="email" className="mt-1 w-full" value={data['contact.email']} onChange={(e) => setData('contact.email', e.target.value)} /></div>
                    <div><InputLabel value={t('site_settings.address_tr')} />
                        <TextInput className="mt-1 w-full" value={data['contact.address_tr']} onChange={(e) => setData('contact.address_tr', e.target.value)} /></div>
                    <div><InputLabel value={t('site_settings.address_en')} />
                        <TextInput className="mt-1 w-full" value={data['contact.address_en']} onChange={(e) => setData('contact.address_en', e.target.value)} /></div>
                    <div><InputLabel value="Facebook" />
                        <TextInput className="mt-1 w-full" value={data['social.facebook']} onChange={(e) => setData('social.facebook', e.target.value)} /></div>
                    <div><InputLabel value="Instagram" />
                        <TextInput className="mt-1 w-full" value={data['social.instagram']} onChange={(e) => setData('social.instagram', e.target.value)} /></div>
                    <div className="sm:col-span-2"><InputLabel value={t('site_settings.maps_embed')} />
                        <TextInput className="mt-1 w-full" value={data['contact.maps_embed']} onChange={(e) => setData('contact.maps_embed', e.target.value)} /></div>
                </div>
                <button type="submit" disabled={processing} className="rounded-lg bg-brand-red px-6 py-2.5 text-sm font-bold text-white disabled:opacity-50">
                    {t('common.save')}
                </button>
            </form>
        </AdminLayout>
    );
}
