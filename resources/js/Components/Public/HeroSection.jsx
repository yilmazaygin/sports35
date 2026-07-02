import CtaButton from '@/Components/Public/CtaButton';
import { useTranslation } from '@/hooks/useTranslation';

export default function HeroSection() {
    const { t } = useTranslation();

    return (
        <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-brand-black">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-black via-zinc-900 to-brand-red/30" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-red/20 via-transparent to-transparent" />
            </div>

            <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
                <span className="mb-4 inline-block rounded-full border border-brand-red/50 bg-brand-red/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-brand-red">
                    {t('hero.badge')}
                </span>
                <h1 className="mb-6 text-4xl font-black uppercase leading-tight tracking-tight text-white sm:text-5xl md:text-7xl">
                    {t('hero.title')}
                </h1>
                <p className="mx-auto mb-10 max-w-2xl text-base text-zinc-300 sm:text-lg md:text-xl">
                    {t('hero.subtitle')}
                </p>
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <CtaButton href="#pricing" variant="primary">
                        {t('hero.cta_primary')}
                    </CtaButton>
                    <CtaButton href="#contact" variant="secondary">
                        {t('hero.cta_secondary')}
                    </CtaButton>
                </div>
            </div>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-zinc-500">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </div>
        </section>
    );
}
