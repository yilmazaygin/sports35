import { usePage } from '@inertiajs/react';
import { useState } from 'react';
import BrandIcon from '@/Components/Public/BrandIcon';
import { useTranslation } from '@/hooks/useTranslation';

function digits(value) {
    return String(value || '').replace(/\D/g, '');
}

function formatWhatsapp(value) {
    const number = digits(value);

    if (number.length === 12 && number.startsWith('90')) {
        return `+90 ${number.slice(2, 5)} ${number.slice(5, 8)} ${number.slice(8, 10)} ${number.slice(10)}`;
    }

    return value;
}

function accountHandle(account) {
    try {
        const path = new URL(account.url).pathname.split('/').filter(Boolean);
        const handle = decodeURIComponent(path.at(-1) || '').replace(/^@/, '');

        if (!handle) {
            return account.name;
        }

        return ['instagram', 'twitter', 'tiktok'].includes(account.platform) ? `@${handle}` : handle;
    } catch {
        return account.name;
    }
}

function DetailCard({ icon, label, value, href, external = false, wrap = false }) {
    const className = 'flex items-center gap-4 rounded-2xl border border-zinc-800 bg-zinc-950/50 px-5 py-4 transition hover:border-brand-red/70';
    const body = (
        <>
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-red/10 text-brand-red">
                <BrandIcon name={icon} className="h-5 w-5" />
            </span>
            <span className="min-w-0">
                <span className="block text-xs font-bold uppercase tracking-[0.14em] text-zinc-400">{label}</span>
                <span className={`mt-1 block text-base font-medium text-white ${wrap ? 'whitespace-normal' : 'truncate'}`}>{value}</span>
            </span>
        </>
    );

    if (!href) {
        return <div className={className}>{body}</div>;
    }

    return (
        <a href={href} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})} className={className}>
            {body}
        </a>
    );
}

export default function LocationPreview({ contact }) {
    const { t } = useTranslation();
    const { locale } = usePage().props;
    const [mapLoaded, setMapLoaded] = useState(false);
    const address = locale === 'en' ? contact.address_en : contact.address_tr;
    const whatsappNumber = digits(contact.whatsapp);
    const socialAccounts = (contact.social_accounts ?? []).filter((account) => account.url && account.platform);

    const contacts = [
        address ? {
            key: 'address',
            icon: 'pin',
            label: t('contact_page.address'),
            value: address,
            href: contact.maps_url || undefined,
            external: Boolean(contact.maps_url),
            wrap: true,
        } : null,
        contact.phone ? {
            key: 'phone',
            icon: 'phone',
            label: t('contact_page.phone'),
            value: contact.phone,
            href: `tel:${String(contact.phone).replace(/[^\d+]/g, '')}`,
        } : null,
        contact.email ? {
            key: 'email',
            icon: 'mail',
            label: t('contact_page.email'),
            value: contact.email,
            href: `mailto:${contact.email}`,
        } : null,
        whatsappNumber ? {
            key: 'whatsapp',
            icon: 'whatsapp',
            label: 'WhatsApp',
            value: formatWhatsapp(contact.whatsapp),
            href: `https://wa.me/${whatsappNumber}`,
            external: true,
        } : null,
    ].filter(Boolean);

    return (
        <section id="contact" className="scroll-mt-28 border-t border-brand-red bg-brand-black py-16 md:py-24">
            <div className="mx-auto max-w-6xl px-4">
                <h2 className="text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl">{t('location_section.title')}</h2>
                <p className="mt-3 text-zinc-400">{t('location_section.subtitle')}</p>

                <div className={`mt-12 grid items-start gap-12 ${contact.maps_embed ? 'lg:grid-cols-2 lg:items-stretch lg:gap-16' : ''}`}>
                    <div>
                        {contacts.length > 0 && (
                            <div className="grid gap-4">
                                {contacts.map(({ key, ...item }) => (
                                    <DetailCard key={key} {...item} />
                                ))}
                            </div>
                        )}

                        {socialAccounts.length > 0 && (
                            <>
                                <div className="my-6 border-t border-zinc-700" />
                                <div className="grid gap-4">
                                    {socialAccounts.map((account) => (
                                        <DetailCard
                                            key={account.platform}
                                            icon={account.platform}
                                            label={account.name}
                                            value={accountHandle(account)}
                                            href={account.url}
                                            external
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {contact.maps_embed && (
                        <div className="relative flex h-80 flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 lg:h-full">
                            {mapLoaded ? (
                                <iframe
                                    title={t('location_section.map_title')}
                                    src={contact.maps_embed}
                                    className="h-full min-h-80 w-full flex-1"
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            ) : (
                                <div className="flex flex-1 flex-col items-start justify-center gap-4 px-6 py-8">
                                    <p className="max-w-sm text-sm leading-relaxed text-zinc-300">{t('location_section.map_note')}</p>
                                    <button
                                        type="button"
                                        onClick={() => setMapLoaded(true)}
                                        className="rounded-lg bg-brand-orange px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-orange-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
                                    >
                                        {t('location_section.show_map')}
                                    </button>
                                    {contact.maps_url && (
                                        <a
                                            href={contact.maps_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-sm text-zinc-300 underline decoration-zinc-600 underline-offset-2 hover:text-white"
                                        >
                                            {t('location_section.open_map')}
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
