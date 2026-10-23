import PublicLayout from '@/Layouts/PublicLayout';
import { Head } from '@inertiajs/react';
import { useTranslation } from '@/hooks/useTranslation';

export default function Show() {
    const { t } = useTranslation();

    return (
        <PublicLayout>
            <Head title={t('seo.cookies_title')} />

            <article className="bg-brand-black py-12 md:py-16">
                <div className="mx-auto max-w-3xl px-4">
                    <h1 className="text-3xl font-black text-white sm:text-4xl">{t('cookie_policy.title')}</h1>
                    <p className="mt-6 text-base leading-relaxed text-zinc-300">{t('cookie_policy.intro')}</p>

                    <h2 className="mt-10 text-lg font-semibold text-white">{t('cookie_policy.technical_title')}</h2>
                    <p className="mt-3 text-base leading-relaxed text-zinc-300">{t('cookie_policy.technical')}</p>
                    <ul className="mt-4 space-y-3 text-sm leading-relaxed text-zinc-300">
                        <li>
                            <span className="font-medium text-white">{t('cookie_policy.session_label')}. </span>
                            {t('cookie_policy.session')}
                        </li>
                        <li>
                            <span className="font-medium text-white">{t('cookie_policy.security_label')}. </span>
                            {t('cookie_policy.security')}
                        </li>
                    </ul>

                    <h2 className="mt-10 text-lg font-semibold text-white">{t('cookie_policy.remember_title')}</h2>
                    <p className="mt-3 text-base leading-relaxed text-zinc-300">{t('cookie_policy.remember')}</p>

                    <h2 className="mt-10 text-lg font-semibold text-white">{t('cookie_policy.storage_title')}</h2>
                    <p className="mt-3 text-base leading-relaxed text-zinc-300">{t('cookie_policy.storage')}</p>

                    <h2 className="mt-10 text-lg font-semibold text-white">{t('cookie_policy.maps_title')}</h2>
                    <p className="mt-3 text-base leading-relaxed text-zinc-300">{t('cookie_policy.maps')}</p>

                    <h2 className="mt-10 text-lg font-semibold text-white">{t('cookie_policy.fonts_title')}</h2>
                    <p className="mt-3 text-base leading-relaxed text-zinc-300">{t('cookie_policy.fonts')}</p>
                </div>
            </article>
        </PublicLayout>
    );
}
