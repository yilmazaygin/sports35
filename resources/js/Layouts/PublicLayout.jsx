import CtaButton from '@/Components/Public/CtaButton';
import JsonLd from '@/Components/Public/JsonLd';
import LanguageSwitcher from '@/Components/Public/LanguageSwitcher';
import Sports35Logo from '@/Components/Public/Sports35Logo';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

export default function PublicLayout({ children }) {
    const { app, contact, structured_data } = usePage().props;
    const { t } = useTranslation();
    const [mobileOpen, setMobileOpen] = useState(false);

    const navItems = [
        { key: 'home', href: route('home') },
        { key: 'services', href: route('services') },
        { key: 'gallery', href: route('gallery') },
        { key: 'transformations', href: route('transformations') },
        { key: 'campaigns', href: route('campaigns') },
        { key: 'blog', href: route('blog.index') },
        { key: 'calculators', href: route('calculators') },
        { key: 'contact', href: route('contact') },
    ];

    const whatsappUrl = `https://wa.me/${contact?.whatsapp || '905000000000'}`;

    return (
        <div className="min-h-screen bg-brand-black text-white">
            <JsonLd data={structured_data} />
            <header className="fixed top-0 z-50 w-full border-b border-zinc-800/50 bg-brand-black/90 backdrop-blur-md">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
                    <Link href={route('home')} className="shrink-0" aria-label={app.name}>
                        <Sports35Logo className="h-10 w-[150px] sm:h-12 sm:w-[180px]" />
                    </Link>

                    <nav className="hidden items-center gap-4 lg:flex xl:gap-6">
                        {navItems.map((item) => (
                            <Link
                                key={item.key}
                                href={item.href}
                                className="whitespace-nowrap text-sm font-medium text-zinc-400 transition hover:text-brand-red"
                            >
                                {t(`nav.${item.key}`)}
                            </Link>
                        ))}
                        <LanguageSwitcher />
                        <CtaButton href={route('free-trial.create')} variant="outline" analyticsEvent="free_trial_cta_click" analyticsSource="header" className="!px-4 !py-2 !text-xs">
                            {t('nav.free_trial')}
                        </CtaButton>
                        <CtaButton href={whatsappUrl} variant="primary" analyticsEvent="whatsapp_click" analyticsSource="header" className="!min-w-[124px] !shrink-0 !whitespace-nowrap !px-4 !py-2 !text-xs">
                            {t('hero.cta_primary')}
                        </CtaButton>
                    </nav>

                    <button
                        type="button"
                        className="text-white lg:hidden"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Menu"
                        aria-expanded={mobileOpen}
                        aria-controls="mobile-navigation"
                    >
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {mobileOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {mobileOpen && (
                    <div id="mobile-navigation" className="border-t border-zinc-800 bg-brand-black px-4 py-4 lg:hidden">
                        <nav className="flex flex-col gap-3">
                            {navItems.map((item) => (
                                <Link
                                    key={item.key}
                                    href={item.href}
                                    className="text-sm font-medium text-zinc-300"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    {t(`nav.${item.key}`)}
                                </Link>
                            ))}
                            <LanguageSwitcher className="pt-2" />
                            <CtaButton href={route('free-trial.create')} variant="outline" analyticsEvent="free_trial_cta_click" analyticsSource="mobile_menu" className="mt-2 w-full" onClick={() => setMobileOpen(false)}>
                                {t('nav.free_trial')}
                            </CtaButton>
                            <CtaButton href={whatsappUrl} variant="primary" analyticsEvent="whatsapp_click" analyticsSource="mobile_menu" className="mt-2 w-full">
                                {t('hero.cta_primary')}
                            </CtaButton>
                        </nav>
                    </div>
                )}
            </header>

            <main className="pt-[73px]">{children}</main>

            <footer className="border-t border-brand-border bg-zinc-950 py-12">
                <div className="mx-auto max-w-6xl px-4 text-center">
                    <Link href={route('home')} className="mb-6 inline-flex" aria-label={app.name}>
                        <Sports35Logo className="h-14 w-[210px]" />
                    </Link>
                    <div className="mb-6 flex flex-wrap justify-center gap-4">
                        <CtaButton href={whatsappUrl} variant="primary" analyticsEvent="whatsapp_click" analyticsSource="footer">WhatsApp</CtaButton>
                        <CtaButton href={route('contact')} variant="outline">{t('nav.contact')}</CtaButton>
                    </div>
                    <p className="text-sm text-zinc-500">
                        &copy; {new Date().getFullYear()} {app.name}. {t('footer.rights')}
                    </p>
                </div>
            </footer>
        </div>
    );
}
