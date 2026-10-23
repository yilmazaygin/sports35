import { useEffect, useRef, useState } from 'react';
import AlertBanner from '@/Components/Public/AlertBanner';
import Sports35Logo from '@/Components/Public/Sports35Logo';
import { usePage } from '@inertiajs/react';
import { useTranslation } from '@/hooks/useTranslation';
import { scrollToSection } from '@/utils/smoothScroll';
import heroImage from '@/../images/sports35/gym-overview.png';
import heroVideo from '@/../images/sports35/general-intro.mp4';

export default function HeroSection({ alert }) {
    const { t } = useTranslation();
    const audioEnabled = Boolean(usePage().props.hero?.video_audio);
    const videoRef = useRef(null);
    const [isMuted, setIsMuted] = useState(true);
    const [isFading, setIsFading] = useState(false);

    useEffect(() => {
        const video = videoRef.current;

        if (!video || audioEnabled) return;

        video.muted = true;
        video.volume = 0;
    }, [audioEnabled]);

    const handleTimeUpdate = (event) => {
        const video = event.currentTarget;

        if (!audioEnabled) {
            video.muted = true;
            video.volume = 0;
        }

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

        if (!video || !audioEnabled) return;

        video.muted = !video.muted;
        setIsMuted(video.muted);
    };

    return (
        <section className="relative flex min-h-[calc(100svh-4rem-env(safe-area-inset-top))] flex-col overflow-hidden lg:min-h-[100svh] lg:-mt-[calc(4rem+env(safe-area-inset-top))]">
            <div className="absolute inset-0 bg-brand-black">
                <video
                    ref={videoRef}
                    className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ${isFading ? 'opacity-0' : 'opacity-100'}`}
                    src={heroVideo}
                    poster={heroImage}
                    autoPlay
                    muted={!audioEnabled || isMuted}
                    playsInline
                    preload="metadata"
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={handleEnded}
                    aria-hidden="true"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-brand-black/60 via-brand-black/45 to-brand-black/25" />
                <div className="absolute inset-0 bg-brand-black/10" />
            </div>

            {audioEnabled && (
                <button
                    type="button"
                    onClick={toggleSound}
                    className={`absolute right-4 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/50 text-white backdrop-blur-sm transition hover:border-brand-red hover:text-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-2 focus:ring-offset-zinc-950 ${alert?.message ? 'top-24 lg:top-[calc(5.5rem+env(safe-area-inset-top))]' : 'top-4 lg:top-[5.75rem]'}`}
                    aria-label={isMuted ? t('hero.sound_on') : t('hero.sound_off')}
                    title={isMuted ? t('hero.sound_on') : t('hero.sound_off')}
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
            )}

            <AlertBanner alert={alert} />

            <div className="relative z-10 flex w-full flex-1 items-center justify-center px-5 pb-36 sm:px-4 sm:pb-0">
                <div className="mx-auto max-w-4xl text-center">
                    <div className="mb-3 flex justify-center lg:mb-4" aria-label="Sports35">
                        <Sports35Logo className="h-32 w-auto sm:h-40 lg:h-52 lg:w-auto" />
                    </div>
                    <h1 className="mb-4 text-3xl font-black uppercase leading-tight tracking-tight text-white sm:text-4xl lg:mb-6 lg:text-5xl">
                        {t('hero.title')}
                    </h1>
                    <p className="mx-auto max-w-md text-base text-zinc-300 sm:max-w-2xl sm:text-lg md:text-xl">
                        {t('hero.subtitle')}
                    </p>
                    <div className="mt-6 flex justify-center lg:mt-8">
                        <button
                            type="button"
                            onClick={() => scrollToSection('why-us')}
                            className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/40 text-white transition hover:border-brand-red hover:text-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-2 focus:ring-offset-zinc-950"
                            aria-label={t('hero.scroll')}
                        >
                            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 9l6 6 6-6" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
