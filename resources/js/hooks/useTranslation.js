import { usePage } from '@inertiajs/react';

export function useTranslation(namespace = 'public') {
    const { translations, locale } = usePage().props;

    const t = (key, replacements = {}) => {
        const keys = key.split('.');
        let value = translations?.[namespace];

        for (const segment of keys) {
            value = value?.[segment];
        }

        if (typeof value !== 'string') {
            return key;
        }

        return Object.entries(replacements).reduce(
            (text, [placeholder, replacement]) =>
                text.replace(`:${placeholder}`, String(replacement)),
            value,
        );
    };

    return { t, locale, translations: translations?.[namespace] ?? {} };
}
