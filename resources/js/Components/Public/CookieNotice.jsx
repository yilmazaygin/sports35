import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

const STORAGE_KEY = 'sports35-cookie-notice';

function readDismissed() {
    try {
        return window.localStorage.getItem(STORAGE_KEY) === '1';
    } catch {
        return false;
    }
}

function storeDismissed() {
    try {
        window.localStorage.setItem(STORAGE_KEY, '1');
    } catch {
        // The notice can still close for this view if storage is blocked.
    }
}

export default function CookieNotice() {
    const { t } = useTranslation();
    const [visible, setVisible] = useState(false);
    const onPolicyPage = route().current('cookies') || route().current('privacy');

    useEffect(() => {
        setVisible(!readDismissed());
    }, []);

    useEffect(() => {
        if (!visible || onPolicyPage) {
            return undefined;
        }

        const onKey = (event) => {
            if (event.key === 'Escape') {
                storeDismissed();
                setVisible(false);
            }
        };

        window.addEventListener('keydown', onKey);

        return () => window.removeEventListener('keydown', onKey);
    }, [visible, onPolicyPage]);

    if (!visible || onPolicyPage) {
        return null;
    }

    const dismiss = () => {
        storeDismissed();
        setVisible(false);
    };

    return (
        <>
            <div aria-hidden="true" className="h-40 sm:hidden" />
            <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                <section
                    role="dialog"
                    aria-label={t('cookies.summary')}
                    className="pointer-events-auto flex w-full max-w-2xl flex-col items-stretch gap-3 rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3.5 shadow-lg shadow-black/40 sm:flex-row sm:items-center sm:gap-4 sm:px-5 sm:py-4"
                >
                    <p className="min-w-0 flex-1 text-sm leading-relaxed text-zinc-300 sm:text-base sm:leading-snug">
                        {t('cookies.summary')}{' '}
                        <Link
                            href={route('cookies')}
                            className="text-zinc-100 underline decoration-zinc-600 underline-offset-2 transition hover:text-white"
                        >
                            {t('cookies.policy_link')}
                        </Link>
                    </p>
                    <button
                        type="button"
                        onClick={dismiss}
                        className="w-full rounded-lg bg-brand-orange px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-orange-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 sm:w-auto sm:shrink-0"
                    >
                        {t('cookies.close')}
                    </button>
                </section>
            </div>
        </>
    );
}
