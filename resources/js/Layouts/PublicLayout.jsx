import BrandIcon from '@/Components/Public/BrandIcon';
import CookieNotice from '@/Components/Public/CookieNotice';
import LanguageSwitcher from '@/Components/Public/LanguageSwitcher';
import Sports35Logo from '@/Components/Public/Sports35Logo';
import { flushSectionScroll, queueSectionScroll, scrollToSection } from '@/utils/smoothScroll';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

function contactDigits(value) {
    return String(value || '').replace(/\D/g, '');
}

export default function PublicLayout({ children, showHeader = true }) {
    const page = usePage();
    const { app, contact, blogEnabled, hasFacilities, locale, seo } = page.props;
    const { t } = useTranslation();
    const brand = app.name && app.name !== 'Laravel' ? app.name : 'Sports35';
    const indexable = page.component !== 'Error' && Boolean(seo?.indexable);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        let frame = 0;
        const onScroll = () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => {
                const next = window.scrollY > 8;
                setScrolled((current) => (current === next ? current : next));
            });
        };

        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });

        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener('scroll', onScroll);
        };
    }, []);

    useEffect(() => {
        document.body.classList.toggle('overflow-hidden', mobileOpen);

        if (!mobileOpen) {
            return () => document.body.classList.remove('overflow-hidden');
        }

        const onKey = (event) => {
            if (event.key === 'Escape') {
                setMobileOpen(false);
            }
        };

        window.addEventListener('keydown', onKey);

        return () => {
            document.body.classList.remove('overflow-hidden');
            window.removeEventListener('keydown', onKey);
        };
    }, [mobileOpen]);

    useEffect(() => {
        const timer = window.setTimeout(flushSectionScroll, 60);

        return () => window.clearTimeout(timer);
    }, []);

    const solidHeader = scrolled || mobileOpen;

    const sectionItems = [
        { key: 'why_us', id: 'why-us' },
        { key: 'pricing', id: 'pricing' },
        { key: 'calculators', id: 'calculators' },
        { key: 'hours', id: 'hours' },
        { key: 'contact', id: 'contact' },
    ];

    const pageItems = [
        { key: 'gallery', href: route('gallery') },
        ...(blogEnabled !== false ? [{ key: 'blog', href: route('blog.index') }] : []),
    ];

    const linkClass = `whitespace-nowrap rounded-sm text-[13px] font-medium transition hover:text-brand-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black xl:text-sm ${
        solidHeader ? 'text-zinc-300' : 'text-white'
    }`;

    const goToSection = (event, id) => {
        event.preventDefault();
        setMobileOpen(false);

        if (route().current('home')) {
            window.requestAnimationFrame(() => window.requestAnimationFrame(() => scrollToSection(id)));

            return;
        }

        queueSectionScroll(id);
        router.visit(route('home'), {
            onCancel: () => queueSectionScroll(null),
            onError: () => queueSectionScroll(null),
        });
    };

    const socialAccounts = (contact?.social_accounts ?? []).filter((account) => account.url && account.platform);
    const footerLinks = [
        { key: 'why_us', id: 'why-us' },
        ...(hasFacilities ? [{ key: 'facilities', id: 'facilities' }] : []),
        ...sectionItems.slice(1),
        ...pageItems,
    ];
    const address = locale === 'en' ? contact?.address_en : contact?.address_tr;
    const phoneDigits = contactDigits(contact?.phone);
    const phoneHref = phoneDigits ? `tel:+${phoneDigits}` : '';
    const whatsappNumber = contactDigits(contact?.whatsapp);
    const whatsappHref = whatsappNumber ? `https://wa.me/${whatsappNumber}` : '';
    const email = String(contact?.email || '').trim();
    const contactLines = [
        address ? { key: 'address', href: contact.maps_url || undefined, external: Boolean(contact.maps_url), value: address } : null,
        phoneHref ? { key: 'phone', href: phoneHref, value: contact.phone } : null,
        email ? { key: 'email', href: `mailto:${email}`, value: email } : null,
    ].filter(Boolean);
    const footerSocials = [
        ...socialAccounts,
        whatsappHref ? { platform: 'whatsapp', name: 'WhatsApp', url: whatsappHref } : null,
    ].filter(Boolean);

    return (
        <div className="flex min-h-dvh flex-col bg-brand-black text-white">
            {indexable && (
                <Head>
                    {seo.description && <meta head-key="description" name="description" content={seo.description} />}
                    <link head-key="canonical" rel="canonical" href={seo.canonical} />
                    {(seo.alternates || []).map((alternate) => (
                        <link
                            key={alternate.hreflang}
                            head-key={`alternate-${alternate.hreflang}`}
                            rel="alternate"
                            hrefLang={alternate.hreflang}
                            href={alternate.href}
                        />
                    ))}
                    <meta head-key="robots" name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
                    <meta head-key="og:site_name" property="og:site_name" content={brand} />
                    <meta head-key="og:locale" property="og:locale" content={seo.locale} />
                    {seo.locale_alternate && <meta head-key="og:locale:alternate" property="og:locale:alternate" content={seo.locale_alternate} />}
                    <meta head-key="og:url" property="og:url" content={seo.canonical} />
                    <meta head-key="og:title" property="og:title" content={seo.document_title} />
                    {seo.description && <meta head-key="og:description" property="og:description" content={seo.description} />}
                    <meta head-key="og:type" property="og:type" content={seo.og_type || 'website'} />
                    {seo.image && <meta head-key="og:image" property="og:image" content={seo.image} />}
                    {seo.image && <meta head-key="og:image:alt" property="og:image:alt" content={seo.document_title} />}
                    {seo.image && <meta head-key="twitter:card" name="twitter:card" content="summary_large_image" />}
                    {seo.image && <meta head-key="twitter:image" name="twitter:image" content={seo.image} />}
                </Head>
            )}
            {showHeader && (
            <>
            <header
                className={`fixed inset-x-0 top-0 z-50 border-b pt-[env(safe-area-inset-top)] max-lg:border-zinc-800 max-lg:bg-brand-black lg:transition-colors lg:duration-200 ${
                    solidHeader
                        ? 'lg:border-zinc-800 lg:bg-brand-black'
                        : 'lg:border-transparent lg:bg-transparent'
                }`}
            >
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4">
                    <Link href={route('home')} className="flex h-10 shrink-0 items-center" aria-label={app.name}>
                        <Sports35Logo className="h-10 w-[60px] xl:h-12 xl:w-[72px]" />
                    </Link>

                    <nav className="hidden items-center lg:flex">
                        <div className="flex items-center gap-x-2.5 xl:gap-x-4">
                            {sectionItems.map((item) => (
                                <a
                                    key={item.id}
                                    href={`${route('home')}#${item.id}`}
                                    className={linkClass}
                                    onClick={(event) => goToSection(event, item.id)}
                                >
                                    {t(`nav.${item.key}`)}
                                </a>
                            ))}
                        </div>
                        <span
                            aria-hidden="true"
                            className={`mx-3 h-4 w-px shrink-0 self-center xl:mx-4 ${solidHeader ? 'bg-zinc-500' : 'bg-white/45'}`}
                        />
                        <div className="flex items-center gap-x-2.5 xl:gap-x-4">
                            {pageItems.map((item) => (
                                <Link key={item.key} href={item.href} className={linkClass}>
                                    {t(`nav.${item.key}`)}
                                </Link>
                            ))}
                        </div>
                        <span
                            aria-hidden="true"
                            className={`mx-3 h-4 w-px shrink-0 self-center xl:mx-4 ${solidHeader ? 'bg-zinc-500' : 'bg-white/45'}`}
                        />
                        <LanguageSwitcher className={solidHeader ? '' : '!text-white hover:!bg-white/10'} />
                    </nav>

                    <button
                        type="button"
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black lg:hidden"
                        onClick={() => setMobileOpen((open) => !open)}
                        aria-label={mobileOpen ? t('nav.close') : t('nav.open')}
                        aria-expanded={mobileOpen}
                        aria-controls="mobile-navigation"
                    >
                        <span className="relative block h-4 w-5">
                            <span className={`absolute left-0 h-0.5 w-5 rounded-full bg-current transition duration-300 ${mobileOpen ? 'top-1.5 rotate-45' : 'top-0'}`} />
                            <span className={`absolute left-0 top-1.5 h-0.5 w-5 rounded-full bg-current transition duration-300 ${mobileOpen ? 'opacity-0' : 'opacity-100'}`} />
                            <span className={`absolute left-0 h-0.5 w-5 rounded-full bg-current transition duration-300 ${mobileOpen ? 'top-1.5 -rotate-45' : 'top-3'}`} />
                        </span>
                    </button>
                </div>
            </header>

            <div className={`fixed inset-0 z-40 lg:hidden ${mobileOpen ? '' : 'pointer-events-none'}`}>
                <button
                    type="button"
                    tabIndex={mobileOpen ? 0 : -1}
                    className={`absolute inset-0 bg-black/70 transition-opacity duration-300 ${mobileOpen ? 'opacity-100' : 'opacity-0'}`}
                    aria-label={t('nav.close')}
                    onClick={() => setMobileOpen(false)}
                />
                <nav
                    id="mobile-navigation"
                    aria-hidden={!mobileOpen}
                    className={`absolute bottom-0 right-0 top-[calc(4rem+env(safe-area-inset-top))] flex w-[min(19rem,86vw)] flex-col border-l border-zinc-800 bg-zinc-950 shadow-2xl transition-transform duration-300 ease-out ${
                        mobileOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
                >
                    <div className="flex flex-1 flex-col gap-1 overflow-y-auto overscroll-contain px-3 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                        {sectionItems.map((item) => (
                            <a
                                key={item.id}
                                href={`${route('home')}#${item.id}`}
                                className="rounded-lg px-3 py-3 text-base font-medium text-zinc-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black"
                                onClick={(event) => goToSection(event, item.id)}
                            >
                                {t(`nav.${item.key}`)}
                            </a>
                        ))}
                        <span aria-hidden="true" className="mx-3 my-2 h-px bg-zinc-800" />
                        {pageItems.map((item) => (
                            <Link
                                key={item.key}
                                href={item.href}
                                className="rounded-lg px-3 py-3 text-base font-medium text-zinc-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black"
                                onClick={() => setMobileOpen(false)}
                            >
                                {t(`nav.${item.key}`)}
                            </Link>
                        ))}
                        <LanguageSwitcher className="mt-2 w-fit" />
                    </div>
                </nav>
            </div>
            </>
            )}

            <main className={`flex flex-1 flex-col ${showHeader ? 'pt-[calc(4rem+env(safe-area-inset-top))]' : ''}`}>{children}</main>

            <footer className="border-t border-zinc-800 bg-zinc-950">
                <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:grid-cols-2 lg:flex lg:items-start lg:justify-between lg:gap-x-16 lg:py-9">
                    <div className="flex justify-center sm:col-span-2 sm:block">
                        <Link href={route('home')} className="inline-flex" aria-label={app.name}>
                            <span className="relative block h-28 w-[162px] overflow-hidden sm:h-44 sm:w-[255px]">
                                <Sports35Logo className="absolute left-1/2 top-1/2 h-[133.16%] w-auto max-w-none -translate-x-1/2 -translate-y-[52%]" />
                            </span>
                        </Link>
                    </div>

                    <nav aria-label={t('footer.navigation')} className="text-center sm:text-left">
                        <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">{t('footer.navigation')}</h2>
                        <ul className="mx-auto mt-3 grid w-full max-w-sm grid-cols-2 gap-x-4 gap-y-1 sm:mx-0 sm:w-max sm:max-w-none sm:grid-cols-[max-content_max-content] sm:gap-x-10 sm:gap-y-2">
                            {footerLinks.map((item, index) => (
                                <li key={item.key} className={index === footerLinks.length - 1 && footerLinks.length % 2 === 1 ? 'col-span-2 sm:col-span-1' : undefined}>
                                    {item.href ? (
                                        <Link href={item.href} className="inline-flex w-full justify-center py-2 text-sm text-zinc-300 transition visited:text-zinc-300 hover:text-white sm:w-auto sm:justify-start sm:whitespace-nowrap sm:py-0">
                                            {t(`nav.${item.key}`)}
                                        </Link>
                                    ) : (
                                        <a
                                            href={`${route('home')}#${item.id}`}
                                            onClick={(event) => goToSection(event, item.id)}
                                            className="inline-flex w-full justify-center py-2 text-sm text-zinc-300 transition visited:text-zinc-300 hover:text-white sm:w-auto sm:justify-start sm:whitespace-nowrap sm:py-0"
                                        >
                                            {t(`nav.${item.key}`)}
                                        </a>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {(contactLines.length > 0 || footerSocials.length > 0) && (
                        <div className="mx-auto max-w-xs text-center sm:mx-0 sm:text-left">
                            <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">{t('footer.contact')}</h2>
                            {contactLines.length > 0 && (
                                <ul className="mt-3 space-y-2">
                                    {contactLines.map((line) => {
                                        const className = `text-sm leading-relaxed text-zinc-400 transition visited:text-zinc-400 hover:text-white ${line.key === 'email' ? 'break-all' : line.key === 'phone' ? 'whitespace-nowrap' : ''}`;

                                        if (!line.href) {
                                            return <li key={line.key} className={className}>{line.value}</li>;
                                        }

                                        return (
                                            <li key={line.key}>
                                                <a
                                                    href={line.href}
                                                    {...(line.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                                                    className={className}
                                                >
                                                    {line.value}
                                                </a>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                            {footerSocials.length > 0 && (
                                <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
                                    {footerSocials.map((account) => (
                                        <a
                                            key={account.platform || account.url}
                                            href={account.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            aria-label={account.name}
                                            title={account.name}
                                            className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-zinc-300 transition hover:border-brand-orange hover:text-brand-orange"
                                        >
                                            <BrandIcon name={account.platform} className="h-4 w-4" />
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="border-t border-zinc-800">
                    <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-4 py-3.5 pb-[max(0.875rem,env(safe-area-inset-bottom))] text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
                        <p className="text-xs text-zinc-400">© {new Date().getFullYear()} {app.name}. {t('footer.rights')}</p>
                        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
                            <Link href={route('privacy')} className="rounded-sm text-xs text-zinc-400 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red">
                                {t('footer.privacy')}
                            </Link>
                            <Link href={route('cookies')} className="rounded-sm text-xs text-zinc-400 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red">
                                {t('footer.cookies')}
                            </Link>
                            <a href={route('login')} className="rounded-sm text-xs text-zinc-400 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red">
                                {t('footer.admin')}
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
            <CookieNotice />
        </div>
    );
}
