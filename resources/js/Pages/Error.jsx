import PublicLayout from '@/Layouts/PublicLayout';
import { Head } from '@inertiajs/react';
import { useTranslation } from '@/hooks/useTranslation';

const knownCodes = [401, 403, 404, 419, 429, 500, 503];

function copyKey(status) {
    return knownCodes.includes(status) ? String(status) : 'fallback';
}

export default function Error({ status = 500, retryAfter = null }) {
    const { t } = useTranslation();
    const code = Number(status) || 500;
    const key = copyKey(code);
    const title = t(`error_pages.${key}.title`);
    const message = t(`error_pages.${key}.message`);
    const homeUrl = route('home');
    const seconds = Number(retryAfter);
    const showRetryHint = Number.isFinite(seconds) && seconds > 0;
    const primary =
        'inline-flex min-h-11 items-center justify-center rounded-lg bg-brand-red px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-red-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black';
    const secondary =
        'inline-flex min-h-11 items-center justify-center rounded-lg border-2 border-white px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-white hover:text-brand-black focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black';

    const goBack = () => {
        if (window.history.length > 1) {
            window.history.back();

            return;
        }

        window.location.assign(homeUrl);
    };

    const actions = [];

    if (code === 401) {
        actions.push({ key: 'login', href: route('login'), label: t('error_pages.login'), variant: 'primary' });
        actions.push({ key: 'home', href: homeUrl, label: t('error_pages.home'), variant: 'secondary' });
    } else if (code === 419) {
        actions.push({ key: 'back', action: goBack, label: t('error_pages.back'), variant: 'primary' });
        actions.push({ key: 'home', href: homeUrl, label: t('error_pages.home'), variant: 'secondary' });
    } else if (code === 429 || code >= 500) {
        actions.push({ key: 'retry', action: () => window.location.reload(), label: t('error_pages.retry'), variant: 'primary' });
        actions.push({ key: 'home', href: homeUrl, label: t('error_pages.home'), variant: 'secondary' });
    } else {
        actions.push({ key: 'home', href: homeUrl, label: t('error_pages.home'), variant: 'primary' });
        actions.push({ key: 'back', action: goBack, label: t('error_pages.back'), variant: 'secondary' });
    }

    return (
        <PublicLayout showHeader={code !== 404}>
            <Head title={title}>
                <meta head-key="robots" name="robots" content="noindex" />
            </Head>

            <section className="relative flex flex-1 items-center overflow-hidden px-4 py-20 sm:py-28" data-error-page={code}>
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(242,90,10,0.18),transparent_58%)]"
                />
                <div className="relative mx-auto w-full max-w-2xl text-center">
                    <p className="text-7xl font-black leading-none tracking-tight text-brand-orange sm:text-8xl">{code}</p>
                    <h1 className="mt-5 text-3xl font-black uppercase tracking-tight text-white sm:text-5xl">{title}</h1>
                    <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-zinc-400 sm:text-lg">{message}</p>
                    {showRetryHint && (
                        <p className="mt-3 text-sm text-zinc-400">{t('error_pages.retry_after', { seconds })}</p>
                    )}
                    <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
                        {actions.map((action) => {
                            const className = action.variant === 'primary' ? primary : secondary;

                            if (action.href) {
                                return (
                                    <a key={action.key} href={action.href} className={className}>
                                        {action.label}
                                    </a>
                                );
                            }

                            return (
                                <button key={action.key} type="button" onClick={action.action} className={className}>
                                    {action.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
