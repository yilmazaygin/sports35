import CtaButton from '@/Components/Public/CtaButton';
import FlashMessage from '@/Components/Admin/FlashMessage';
import InputError from '@/Components/InputError';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useTranslation } from '@/hooks/useTranslation';
import { trackEvent } from '@/utils/trackEvent';
import { useEffect, useRef } from 'react';

export default function Index() {
    const { t } = useTranslation();
    const { flash } = usePage().props;
    const started = useRef(false);
    const form = useForm({
        first_name: '', last_name: '', phone: '', email: '', interested_service: '', note: '',
        privacy_consent: false, marketing_consent: false, website: '',
    });

    useEffect(() => {
        if (!started.current) { trackEvent('free_trial_form_start'); started.current = true; }
    }, []);

    const submit = (event) => {
        event.preventDefault();
        form.post(route('free-trial.store'), { onSuccess: () => form.reset('first_name', 'last_name', 'phone', 'email', 'interested_service', 'note', 'privacy_consent', 'marketing_consent') });
    };

    return (
        <PublicLayout>
            <Head title={t('free_trial.title')} />
            <section className="bg-brand-black py-12 md:py-16">
                <div className="mx-auto max-w-3xl px-4">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-black uppercase text-white sm:text-4xl">{t('free_trial.title')}</h1>
                        <p className="mt-3 text-zinc-400">{t('free_trial.subtitle')}</p>
                    </div>

                    <FlashMessage />
                    {!flash?.success && (
                        <form onSubmit={submit} className="space-y-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 sm:p-8">
                            <div className="grid gap-5 sm:grid-cols-2">
                                <Field label={t('free_trial.first_name')} value={form.data.first_name} error={form.errors.first_name} onChange={(e) => form.setData('first_name', e.target.value)} />
                                <Field label={t('free_trial.last_name')} value={form.data.last_name} error={form.errors.last_name} onChange={(e) => form.setData('last_name', e.target.value)} />
                                <Field label={t('free_trial.phone')} type="tel" value={form.data.phone} error={form.errors.phone} onChange={(e) => form.setData('phone', e.target.value)} />
                                <Field label={t('free_trial.email')} type="email" value={form.data.email} error={form.errors.email} onChange={(e) => form.setData('email', e.target.value)} />
                            </div>
                            <Field label={t('free_trial.interested_service')} value={form.data.interested_service} error={form.errors.interested_service} onChange={(e) => form.setData('interested_service', e.target.value)} />
                            <div>
                                <label className="text-sm font-medium text-zinc-300">{t('free_trial.note')}</label>
                                <textarea value={form.data.note} onChange={(e) => form.setData('note', e.target.value)} rows={4} className="mt-1 w-full rounded-lg border-zinc-700 bg-zinc-950 text-white focus:border-brand-red focus:ring-brand-red" />
                                <InputError message={form.errors.note} className="mt-1" />
                            </div>

                            <div className="space-y-4 border-t border-zinc-800 pt-5 text-sm text-zinc-300">
                                <label className="flex items-start gap-3">
                                    <input type="checkbox" checked={form.data.privacy_consent} onChange={(e) => form.setData('privacy_consent', e.target.checked)} className="mt-1 rounded border-zinc-600 bg-zinc-950 text-brand-red focus:ring-brand-red" />
                                    <span>{t('free_trial.privacy_consent')} <span className="text-brand-red">*</span><span className="mt-1 block text-xs text-zinc-500">{t('free_trial.privacy_placeholder')}</span></span>
                                </label>
                                <InputError message={form.errors.privacy_consent} />
                                <label className="flex items-start gap-3">
                                    <input type="checkbox" checked={form.data.marketing_consent} onChange={(e) => form.setData('marketing_consent', e.target.checked)} className="mt-1 rounded border-zinc-600 bg-zinc-950 text-brand-red focus:ring-brand-red" />
                                    <span>{t('free_trial.marketing_consent')}</span>
                                </label>
                            </div>
                            <div className="hidden" aria-hidden="true"><label>Website<input value={form.data.website} onChange={(e) => form.setData('website', e.target.value)} tabIndex={-1} autoComplete="off" /></label></div>
                            <button type="submit" disabled={form.processing} className="w-full rounded-lg bg-brand-red px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-red-dark disabled:opacity-60">
                                {form.processing ? t('free_trial.sending') : t('free_trial.submit')}
                            </button>
                        </form>
                    )}
                    <div className="mt-6 text-center"><CtaButton href={route('contact')} variant="outline">{t('free_trial.contact_link')}</CtaButton></div>
                </div>
            </section>
        </PublicLayout>
    );
}

function Field({ label, type = 'text', value, onChange, error }) {
    return <div><label className="text-sm font-medium text-zinc-300">{label}</label><input type={type} value={value} onChange={onChange} className="mt-1 w-full rounded-lg border-zinc-700 bg-zinc-950 text-white focus:border-brand-red focus:ring-brand-red" /><InputError message={error} className="mt-1" /></div>;
}
