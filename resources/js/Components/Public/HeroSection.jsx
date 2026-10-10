import { useRef, useState } from 'react';
import CtaButton from '@/Components/Public/CtaButton';
import Sports35Logo from '@/Components/Public/Sports35Logo';
import { useTranslation } from '@/hooks/useTranslation';
import heroImage from '@/../images/sports35/gym-overview.png';
import heroVideo from '@/../images/sports35/general-intro.mp4';

export default function HeroSection() {
    const { t } = useTranslation();
    const videoRef = useRef(null);
    const [isMuted, setIsMuted] = useState(true);
    const [isFading, setIsFading] = useState(false);

    const handleTimeUpdate = (event) => {
        const video = event.currentTarget;

        if (video.duration && video.currentTime >= video.duration - 0.8) {
            setIsFading(true);
        }
    };

    const handleEnded = (event) => {
        const video = event.currentTarget;
        video.currentTime = 0;
        video.play().catch(() => {});

        window.setTimeout(() => setIsFading(false), 500);
    };

    const toggleSound = () => {
        const video = videoRef.current;

        if (!video) return;

        video.muted = !video.muted;
        setIsMuted(video.muted);
    };

    return (
        <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-brand-black">
                <video
                    ref={videoRef}
                    className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ${isFading ? 'opacity-0' : 'opacity-100'}`}
                    src={heroVideo}
                    poster={heroImage}
                    autoPlay
                    muted
                    playsInline
                    preload="metadata"
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={handleEnded}
                    aria-hidden="true"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-brand-black/60 via-brand-black/45 to-brand-black/25" />
                <div className="absolute inset-0 bg-brand-black/10" />
            </div>

            <button
                type="button"
                onClick={toggleSound}
                className="absolute right-4 top-6 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/50 text-white backdrop-blur-sm transition hover:border-brand-red hover:text-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-2 focus:ring-offset-zinc-950"
                aria-label={isMuted ? 'Sesi aç' : 'Sesi kapat'}
                title={isMuted ? 'Sesi aç' : 'Sesi kapat'}
            >
                {isMuted ? (
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5 6 9H3v6h3l5 4V5Zm8 4-4 6m0-6 4 6" />
                    </svg>
                ) : (
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5 6 9H3v6h3l5 4V5Zm4.5 3.5a5 5 0 0 1 0 7m2.5-9.5a8.5 8.5 0 0 1 0 12" />
                    </svg>
                )}
            </button>

            <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
                <div className="mb-4 flex justify-center" aria-label="Sports35 Fitness Center">
                    <Sports35Logo className="h-64 w-[min(880px,92vw)] sm:h-80 sm:w-[min(1120px,80vw)]" />
                </div>
                <h1 className="mb-6 text-4xl font-black uppercase leading-tight tracking-tight text-white sm:text-5xl md:text-7xl">
                    {t('hero.title')}
                </h1>
                <p className="mx-auto mb-10 max-w-2xl text-base text-zinc-300 sm:text-lg md:text-xl">
                    {t('hero.subtitle')}
                </p>
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <CtaButton href={route('free-trial.create')} variant="primary">
                        {t('nav.free_trial')}
                    </CtaButton>
                    <CtaButton href={route('contact')} variant="secondary">
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
