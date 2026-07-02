import AdminLayout from '@/Layouts/AdminLayout';
import FlashMessage from '@/Components/Admin/FlashMessage';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';
import { useTranslation } from '@/hooks/useTranslation';

export default function Edit({ hours }) {
    const { t } = useTranslation('admin');
    const { data, setData, put, processing, errors } = useForm({
        hours: hours.map((h) => ({
            id: h.id,
            opens_at: h.opens_at || '09:00',
            closes_at: h.closes_at || '22:00',
            is_closed: h.is_closed,
        })),
    });

    const updateHour = (index, field, value) => {
        const updated = [...data.hours];
        updated[index] = { ...updated[index], [field]: value };
        setData('hours', updated);
    };

    const submit = (e) => {
        e.preventDefault();
        put(route('working-hours.update'));
    };

    return (
        <AdminLayout
            header={
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900">{t('working_hours.title')}</h1>
                    <p className="mt-1 text-sm text-zinc-500">{t('working_hours.subtitle')}</p>
                </div>
            }
        >
            <Head title={t('working_hours.title')} />
            <FlashMessage />

            <form onSubmit={submit} className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
                <div className="space-y-4">
                    {hours.map((hour, index) => (
                        <div
                            key={hour.id}
                            className="grid items-center gap-4 border-b border-zinc-100 pb-4 last:border-0 sm:grid-cols-4"
                        >
                            <div className="font-medium text-zinc-900">
                                {t(`working_hours.days.${hour.day_key}`)}
                            </div>
                            <div>
                                <InputLabel value={t('working_hours.opens')} />
                                <TextInput
                                    type="time"
                                    value={data.hours[index].opens_at}
                                    disabled={data.hours[index].is_closed}
                                    onChange={(e) => updateHour(index, 'opens_at', e.target.value)}
                                    className="mt-1 w-full"
                                />
                            </div>
                            <div>
                                <InputLabel value={t('working_hours.closes')} />
                                <TextInput
                                    type="time"
                                    value={data.hours[index].closes_at}
                                    disabled={data.hours[index].is_closed}
                                    onChange={(e) => updateHour(index, 'closes_at', e.target.value)}
                                    className="mt-1 w-full"
                                />
                            </div>
                            <label className="flex items-center gap-2 pt-6">
                                <Checkbox
                                    checked={data.hours[index].is_closed}
                                    onChange={(e) => updateHour(index, 'is_closed', e.target.checked)}
                                />
                                <span className="text-sm text-zinc-600">{t('working_hours.is_closed')}</span>
                            </label>
                        </div>
                    ))}
                </div>
                <InputError message={errors.hours} className="mt-4" />
                <button
                    type="submit"
                    disabled={processing}
                    className="mt-6 rounded-lg bg-brand-red px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-red-dark disabled:opacity-50"
                >
                    {t('common.save')}
                </button>
            </form>
        </AdminLayout>
    );
}
