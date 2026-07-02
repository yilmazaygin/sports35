import { usePage } from '@inertiajs/react';
import { useTranslation } from '@/hooks/useTranslation';

function TranslateIcon({ className = 'h-5 w-5' }) {
    return (
        <svg
            className={className}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.75}
                d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802"
            />
        </svg>
    );
}

export default function LanguageSwitcher({ className = '' }) {
    const { locale, locales } = usePage().props;
    const { t } = useTranslation();
    const otherLocale = locales.find((code) => code !== locale) ?? locales[0];

    return (
        <a
            href={route('locale.switch', otherLocale)}
            className={`inline-flex items-center justify-center rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white ${className}`}
            aria-label={t('language.switch')}
            title={t('language.switch')}
        >
            <TranslateIcon />
        </a>
    );
}
