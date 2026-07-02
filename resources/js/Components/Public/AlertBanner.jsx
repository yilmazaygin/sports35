import { useTranslation } from '@/hooks/useTranslation';

export default function AlertBanner({ alert }) {
    const { t } = useTranslation();

    if (!alert) {
        return null;
    }

    return (
        <div className="bg-brand-red px-4 py-3 text-center text-sm font-medium text-white">
            <span className="font-bold">{t('alert.title')}:</span> {alert.message}
        </div>
    );
}
