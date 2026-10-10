import CtaButton from '@/Components/Public/CtaButton';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head } from '@inertiajs/react';
import { useTranslation } from '@/hooks/useTranslation';
import { trackEvent } from '@/utils/trackEvent';

export default function Index({ contact, socialPosts = [] }) {
    const { t } = useTranslation();
    const whatsappUrl = `https://wa.me/${contact.whatsapp}`;

    return (
        <PublicLayout>
            <Head title={t('contact_page.title')} />

            <section className="bg-brand-black py-12 md:py-16">
                <div className="mx-auto max-w-6xl px-4">
                    <div className="mb-12 text-center">
                        <h1 className="text-3xl font-black uppercase text-white sm:text-4xl">{t('contact_page.title')}</h1>
                        <p className="mt-3 text-zinc-400">{t('contact_page.subtitle')}</p>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-2">
                        <div className="space-y-6">
                            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                                <h2 className="text-sm font-medium uppercase tracking-wider text-zinc-500">{t('contact_page.phone')}</h2>
                                <a href={`tel:${contact.phone}`} onClick={() => trackEvent('phone_click', { cta_source: 'contact_page' })} className="mt-2 block text-xl font-bold text-white hover:text-brand-red">
                                    {contact.phone}
                                </a>
                            </div>
                            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                                <h2 className="text-sm font-medium uppercase tracking-wider text-zinc-500">{t('contact_page.email')}</h2>
                                <a href={`mailto:${contact.email}`} onClick={() => trackEvent('email_click', { cta_source: 'contact_page' })} className="mt-2 block text-xl font-bold text-white hover:text-brand-red">
                                    {contact.email}
                                </a>
                            </div>
                            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                                <h2 className="text-sm font-medium uppercase tracking-wider text-zinc-500">{t('contact_page.address')}</h2>
                                <p className="mt-2 text-lg text-white">{contact.address}</p>
                            </div>
                            <CtaButton href={whatsappUrl} variant="primary" analyticsEvent="whatsapp_click" analyticsSource="contact_page" className="w-full sm:w-auto">
                                {t('contact_page.whatsapp')}
                            </CtaButton>

                            {(contact.facebook || contact.instagram) && (
                                <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                                    <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-zinc-500">
                                        {t('contact_page.follow_us')}
                                    </h2>
                                    <div className="flex gap-4">
                                        {contact.instagram && (
                                            <a href={contact.instagram} target="_blank" rel="noopener noreferrer"
                                                className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium hover:bg-brand-red">
                                                Instagram
                                            </a>
                                        )}
                                        {contact.facebook && (
                                            <a href={contact.facebook} target="_blank" rel="noopener noreferrer"
                                                className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium hover:bg-brand-red">
                                                Facebook
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}

                            {socialPosts.length > 0 && (
                                <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                                    <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-zinc-500">
                                        {t('contact_page.social_feed')}
                                    </h2>
                                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                        {socialPosts.map((post, index) => (
                                            <a
                                                key={index}
                                                href={post.post_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group overflow-hidden rounded-lg"
                                                title={post.caption || undefined}
                                            >
                                                <img
                                                    src={post.image_url}
                                                    alt={post.caption || post.platform}
                                                    className="aspect-square w-full object-cover transition group-hover:opacity-80"
                                                    loading="lazy"
                                                />
                                            </a>
                                        ))}
                                    </div>
                                    <p className="mt-4 text-sm text-zinc-500">{t('contact_page.social_feed_note')}</p>
                                </div>
                            )}
                        </div>

                        {contact.maps_embed && (
                            <div className="overflow-hidden rounded-xl border border-zinc-800">
                                <iframe
                                    src={contact.maps_embed}
                                    className="h-full min-h-[400px] w-full"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Google Maps"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
