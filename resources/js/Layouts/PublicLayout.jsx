import CtaButton from '@/Components/Public/CtaButton';
import JsonLd from '@/Components/Public/JsonLd';
import LanguageSwitcher from '@/Components/Public/LanguageSwitcher';
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
                    <Link href={route('home')} className="text-xl font-black uppercase tracking-wider">
                        <span className="text-white">{app.name}</span>
                    </Link>

                    <nav className="hidden items-center gap-4 lg:flex xl:gap-6">
                        {navItems.map((item) => (
                            <Link
                                key={item.key}
                                href={item.href}
                                className="text-sm font-medium text-zinc-400 transition hover:text-brand-red"
                            >
                                {t(`nav.${item.key}`)}
                            </Link>
                        ))}
                        <LanguageSwitcher />
                        <CtaButton href={whatsappUrl} variant="primary" className="!px-4 !py-2 !text-xs">
                            {t('hero.cta_primary')}
                        </CtaButton>
                    </nav>

                    <button
                        type="button"
                        className="text-white lg:hidden"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Menu"
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
                    <div className="border-t border-zinc-800 bg-brand-black px-4 py-4 lg:hidden">
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
                            <CtaButton href={whatsappUrl} variant="primary" className="mt-2 w-full">
                                {t('hero.cta_primary')}
                            </CtaButton>
                        </nav>
                    </div>
                )}
            </header>

            <main className="pt-[73px]">{children}</main>

            <footer className="border-t border-zinc-800 bg-zinc-950 py-12">
                <div className="mx-auto max-w-6xl px-4 text-center">
                    <div className="mb-6 flex flex-wrap justify-center gap-4">
                        <CtaButton href={whatsappUrl} variant="primary">WhatsApp</CtaButton>
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
