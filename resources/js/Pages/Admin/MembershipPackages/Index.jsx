import AdminLayout from '@/Layouts/AdminLayout';
import FlashMessage from '@/Components/Admin/FlashMessage';
import Checkbox from '@/Components/Checkbox';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { confirmDelete } from '@/utils/confirmDelete';

export default function Index({ packages }) {
    const { t } = useTranslation('admin');
    const [editingId, setEditingId] = useState(null);

    const createForm = useForm({
        duration_months: 1,
        cash_price: '',
        card_price: '',
        is_active: true,
        sort_order: packages.length + 1,
    });

    const editForm = useForm({
        duration_months: 1,
        cash_price: '',
        card_price: '',
        is_active: true,
        sort_order: 0,
    });

    const startEdit = (pkg) => {
        setEditingId(pkg.id);
        editForm.setData({
            duration_months: pkg.duration_months,
            cash_price: pkg.cash_price,
            card_price: pkg.card_price,
            is_active: pkg.is_active,
            sort_order: pkg.sort_order,
        });
    };

    return (
        <AdminLayout
            header={
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900">{t('membership_packages.title')}</h1>
                    <p className="mt-1 text-sm text-zinc-500">{t('membership_packages.subtitle')}</p>
                </div>
            }
        >
            <Head title={t('membership_packages.title')} />
            <FlashMessage />

            <div className="mb-8 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 font-semibold text-zinc-900">{t('membership_packages.add')}</h2>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        createForm.post(route('membership-packages.store'), {
                            onSuccess: () => createForm.reset(),
                        });
                    }}
                    className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
                >
                    <div>
                        <InputLabel value={t('membership_packages.duration')} />
                        <TextInput type="number" className="mt-1 w-full" value={createForm.data.duration_months}
                            onChange={(e) => createForm.setData('duration_months', e.target.value)} />
                    </div>
                    <div>
                        <InputLabel value={t('membership_packages.price')} />
                        <TextInput type="number" step="0.01" className="mt-1 w-full" value={createForm.data.cash_price}
                            onChange={(e) => createForm.setData('cash_price', e.target.value)} />
                    </div>
                    <div>
                        <InputLabel value={t('membership_packages.card_price')} />
                        <TextInput type="number" step="0.01" className="mt-1 w-full" value={createForm.data.card_price}
                            onChange={(e) => createForm.setData('card_price', e.target.value)} />
                    </div>
                    <div className="flex items-end">
                        <label className="flex items-center gap-2">
                            <Checkbox checked={createForm.data.is_active}
                                onChange={(e) => createForm.setData('is_active', e.target.checked)} />
                            <span className="text-sm">{t('common.active')}</span>
                        </label>
                    </div>
                    <div className="flex items-end">
                        <button type="submit" className="rounded-lg bg-brand-red px-4 py-2 text-sm font-bold text-white">
                            {t('common.create')}
                        </button>
                    </div>
                </form>
            </div>

            <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
                <table className="w-full text-sm">
                    <thead className="bg-zinc-50 text-left text-zinc-500">
                        <tr>
                            <th className="px-4 py-3">{t('membership_packages.duration')}</th>
                            <th className="px-4 py-3">{t('membership_packages.price')}</th>
                            <th className="px-4 py-3">{t('membership_packages.card_price')}</th>
                            <th className="px-4 py-3">{t('common.active')}</th>
                            <th className="px-4 py-3">{t('common.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {packages.map((pkg) => (
                            <tr key={pkg.id} className="border-t border-zinc-100">
                                {editingId === pkg.id ? (
                                    <>
                                        <td className="px-4 py-3">
                                            <TextInput type="number" className="w-20" value={editForm.data.duration_months}
                                                onChange={(e) => editForm.setData('duration_months', e.target.value)} />
                                        </td>
                                        <td className="px-4 py-3">
                                            <TextInput type="number" step="0.01" className="w-28" value={editForm.data.cash_price}
                                                onChange={(e) => editForm.setData('cash_price', e.target.value)} />
                                        </td>
                                        <td className="px-4 py-3">
                                            <TextInput type="number" step="0.01" className="w-28" value={editForm.data.card_price}
                                                onChange={(e) => editForm.setData('card_price', e.target.value)} />
                                        </td>
                                        <td className="px-4 py-3">
                                            <Checkbox checked={editForm.data.is_active}
                                                onChange={(e) => editForm.setData('is_active', e.target.checked)} />
                                        </td>
                                        <td className="px-4 py-3">
                                            <button onClick={() => editForm.put(route('membership-packages.update', pkg.id), { onSuccess: () => setEditingId(null) })}
                                                className="mr-2 text-brand-red font-medium">{t('common.save')}</button>
                                            <button onClick={() => setEditingId(null)} className="text-zinc-500">{t('common.cancel')}</button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td className="px-4 py-3 font-medium">{pkg.duration_months} ay</td>
                                        <td className="px-4 py-3">₺{Number(pkg.cash_price).toLocaleString('tr-TR')}</td>
                                        <td className="px-4 py-3">₺{Number(pkg.card_price).toLocaleString('tr-TR')}</td>
                                        <td className="px-4 py-3">{pkg.is_active ? t('common.active') : t('common.inactive')}</td>
                                        <td className="px-4 py-3">
                                            <button onClick={() => startEdit(pkg)} className="mr-3 text-brand-red">{t('common.edit')}</button>
                                            <button onClick={() => confirmDelete(t('common.confirm_delete')) && router.delete(route('membership-packages.destroy', pkg.id))}
                                                className="text-red-600">{t('common.delete')}</button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
