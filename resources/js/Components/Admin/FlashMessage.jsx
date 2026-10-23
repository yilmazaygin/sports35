import { useEffect, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { useTranslation } from '@/hooks/useTranslation';

function readFlash(flash) {
    const message = flash?.error || flash?.success;

    if (!message) {
        return null;
    }

    return {
        id: Date.now(),
        message,
        tone: flash?.error ? 'error' : 'success',
    };
}

export default function FlashMessage() {
    const page = usePage();
    const { t } = useTranslation('admin');
    const [notice, setNotice] = useState(() => readFlash(page.props.flash));

    useEffect(() => router.on('success', (event) => {
        const next = readFlash(event.detail.page.props.flash);
        if (next) {
            setNotice(next);
        }
    }), []);

    useEffect(() => {
        if (!notice) {
            return undefined;
        }

        const timer = window.setTimeout(() => setNotice(null), 4200);
        return () => window.clearTimeout(timer);
    }, [notice]);

    if (!notice) {
        return null;
    }

    return (
        <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
            <div
                role="status"
                aria-live="polite"
                className={`pointer-events-auto flex max-w-md items-start gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white shadow-lg ${notice.tone === 'error' ? 'bg-red-600' : 'bg-zinc-950'}`}
            >
                <span>{notice.message}</span>
                <button
                    type="button"
                    onClick={() => setNotice(null)}
                    className="text-white/70 hover:text-white"
                    aria-label={t('common.close')}
                >
                    ×
                </button>
            </div>
        </div>
    );
}
