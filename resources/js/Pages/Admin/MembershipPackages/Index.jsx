import AdminLayout from '@/Layouts/AdminLayout';
import FlashMessage from '@/Components/Admin/FlashMessage';
import Checkbox from '@/Components/Checkbox';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Badge, Button, FormErrors, PageHeader, Panel, useComposer } from '@/Components/Admin/ui';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { confirmDelete } from '@/utils/confirmDelete';

function emptyPrices(variations) {
    return Object.fromEntries(variations.map((variation) => [variation.id, '']));
}

function emptyPackagePrices(packages) {
    return Object.fromEntries(packages.map((pkg) => [pkg.id, '']));
}

function durationLabel(t, count) {
    return t(count === 1 ? 'membership_packages.month' : 'membership_packages.months', { count });
}

function variationHeading(variation, t) {
    return variation.is_active
        ? variation.name_tr
        : `${variation.name_tr} (${t('common.inactive')})`;
}

export default function Index({ packages, variations }) {
    const { t } = useTranslation('admin');
    const [editingId, setEditingId] = useState(null);
    const [editingVariationId, setEditingVariationId] = useState(null);
    const hasVariations = variations.length > 0;

    const createForm = useForm({
        duration_months: 1,
        price: '',
        is_active: true,
        sort_order: packages.length + 1,
        variation_prices: emptyPrices(variations),
    });
    const editForm = useForm({
        duration_months: 1,
        price: '',
        is_active: true,
        sort_order: 0,
        variation_prices: {},
    });
    const variationForm = useForm({
        name_tr: '',
        name_en: '',
        package_prices: emptyPackagePrices(packages),
    });
    const variationEditForm = useForm({
        name_tr: '',
        name_en: '',
    });
    const composer = useComposer(createForm);
    const variationComposer = useComposer(variationForm);

    const startEdit = (pkg) => {
        setEditingId(pkg.id);
        editForm.setData({
            duration_months: pkg.duration_months,
            price: pkg.price,
            is_active: pkg.is_active,
            sort_order: pkg.sort_order,
            variation_prices: Object.fromEntries(
                variations.map((variation) => [
                    variation.id,
                    pkg.variation_prices?.[variation.id] ?? '',
                ]),
            ),
        });
    };

    const startVariationEdit = (variation) => {
        setEditingVariationId(variation.id);
        variationEditForm.setData({
            name_tr: variation.name_tr,
            name_en: variation.name_en,
        });
    };

    const setVariationPrice = (form, id, value) => {
        form.setData('variation_prices', {
            ...form.data.variation_prices,
            [id]: value,
        });
    };

    const setPackagePrice = (id, value) => {
        variationForm.setData('package_prices', {
            ...variationForm.data.package_prices,
            [id]: value,
        });
    };

    return (
        <AdminLayout header={
            <PageHeader
                title={t('membership_packages.title')}
                description={t('membership_packages.subtitle')}
                actions={(
                    <Button type="button" variant={composer.open ? 'secondary' : 'primary'} onClick={composer.toggle}>
                        {composer.open ? t('common.cancel') : t('membership_packages.add')}
                    </Button>
                )}
            />
        }>
            <Head title={t('membership_packages.title')} />
            <FlashMessage />

            <Panel>
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-base font-semibold text-zinc-950">{t('membership_packages.variations')}</h2>
                    <Button type="button" variant={variationComposer.open ? 'secondary' : 'primary'} onClick={variationComposer.toggle}>
                        {variationComposer.open ? t('common.cancel') : t('membership_packages.add_variation')}
                    </Button>
                </div>
                <p className="mt-2 text-sm leading-6 text-zinc-500">{t('membership_packages.variation_hint')}</p>
                {hasVariations && <p className="mt-1 text-sm leading-6 text-zinc-500">{t('membership_packages.order_hint')}</p>}

                {variationComposer.open && (
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            variationForm.post(route('membership-packages.variations.store'), {
                                onSuccess: () => {
                                    variationForm.reset();
                                    variationComposer.close();
                                },
                            });
                        }}
                        className="mt-5 space-y-4 border-t border-zinc-100 pt-5"
                    >
                        <FormErrors errors={variationForm.errors} />
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <InputLabel value={t('membership_packages.variation_name_tr')} />
                                <TextInput className="mt-1 w-full" value={variationForm.data.name_tr} onChange={(event) => variationForm.setData('name_tr', event.target.value)} />
                            </div>
                            <div>
                                <InputLabel value={t('membership_packages.variation_name_en')} />
                                <TextInput className="mt-1 w-full" value={variationForm.data.name_en} onChange={(event) => variationForm.setData('name_en', event.target.value)} />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-zinc-950">{t('membership_packages.variation_prices')}</h3>
                            {packages.length === 0 ? (
                                <p className="mt-2 text-sm text-zinc-500">{t('membership_packages.no_durations')}</p>
                            ) : (
                                <ul className="mt-2 divide-y divide-zinc-100 rounded-xl border border-zinc-200">
                                    {packages.map((pkg) => (
                                        <li key={pkg.id} className="flex flex-wrap items-center gap-3 px-3 py-3">
                                            <div className="min-w-0 flex-1">
                                                <p className="font-medium text-zinc-950">{durationLabel(t, pkg.duration_months)}</p>
                                                <p className="text-sm text-zinc-500">{t('membership_packages.normal_price')}: ₺{Number(pkg.price).toLocaleString('tr-TR')}</p>
                                            </div>
                                            <TextInput
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                className="w-36"
                                                placeholder="—"
                                                aria-label={`${durationLabel(t, pkg.duration_months)} ${t('membership_packages.price')}`}
                                                value={variationForm.data.package_prices[pkg.id] ?? ''}
                                                onChange={(event) => setPackagePrice(pkg.id, event.target.value)}
                                            />
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <Button type="submit" disabled={variationForm.processing}>{t('common.create')}</Button>
                    </form>
                )}

                {hasVariations && (
                    <ul className="mt-4 divide-y divide-zinc-100">
                        {variations.map((variation, index) => (
                            <li key={variation.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center">
                                <div className="flex min-w-0 flex-1 items-center gap-3">
                                    <div className="flex flex-col overflow-hidden rounded-lg border border-zinc-200">
                                        <button type="button" disabled={index === 0} aria-label={t('membership_packages.move_up')} onClick={() => router.post(route('membership-packages.variations.move', variation.id), { direction: 'up' }, { preserveScroll: true })} className="px-2 py-1 text-zinc-600 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:text-zinc-300">↑</button>
                                        <button type="button" disabled={index === variations.length - 1} aria-label={t('membership_packages.move_down')} onClick={() => router.post(route('membership-packages.variations.move', variation.id), { direction: 'down' }, { preserveScroll: true })} className="border-t border-zinc-200 px-2 py-1 text-zinc-600 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:text-zinc-300">↓</button>
                                    </div>
                                    {editingVariationId === variation.id ? (
                                        <div className="flex flex-1 flex-wrap items-center gap-2">
                                            <TextInput className="w-40" value={variationEditForm.data.name_tr} onChange={(event) => variationEditForm.setData('name_tr', event.target.value)} />
                                            <TextInput className="w-40" value={variationEditForm.data.name_en} onChange={(event) => variationEditForm.setData('name_en', event.target.value)} />
                                            <Button type="button" size="sm" onClick={() => variationEditForm.put(route('membership-packages.variations.update', variation.id), { onSuccess: () => setEditingVariationId(null) })}>{t('common.save')}</Button>
                                            <Button type="button" variant="secondary" size="sm" onClick={() => setEditingVariationId(null)}>{t('common.cancel')}</Button>
                                        </div>
                                    ) : (
                                        <div className="min-w-0">
                                            <p className={`font-medium ${variation.is_active ? 'text-zinc-950' : 'text-zinc-400'}`}>{variation.name_tr}</p>
                                            <p className="text-sm text-zinc-500">{variation.name_en}</p>
                                        </div>
                                    )}
                                    {editingVariationId !== variation.id && (
                                        <Badge tone={variation.is_active ? 'success' : 'neutral'}>{variation.is_active ? t('common.active') : t('common.inactive')}</Badge>
                                    )}
                                </div>
                                {editingVariationId !== variation.id && (
                                    <div className="flex flex-wrap gap-1">
                                        <Button type="button" variant="ghost" size="sm" onClick={() => startVariationEdit(variation)}>{t('common.edit')}</Button>
                                        <Button type="button" variant="secondary" size="sm" onClick={() => router.patch(route('membership-packages.variations.active', variation.id), { is_active: !variation.is_active }, { preserveScroll: true })}>
                                            {variation.is_active ? t('membership_packages.deactivate') : t('membership_packages.activate')}
                                        </Button>
                                        <Button type="button" variant="danger" size="sm" onClick={() => confirmDelete(t('common.confirm_delete')) && router.delete(route('membership-packages.variations.destroy', variation.id))}>{t('common.delete')}</Button>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </Panel>

            {composer.open && (
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        createForm.post(route('membership-packages.store'), {
                            onSuccess: () => {
                                createForm.reset();
                                composer.close();
                            },
                        });
                    }}
                    className="mt-6"
                >
                    <Panel>
                        <h2 className="text-base font-semibold text-zinc-950">{t('membership_packages.add')}</h2>
                        <div className="mt-4">
                            <FormErrors errors={createForm.errors} />
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <div>
                                <InputLabel value={t('membership_packages.duration')} />
                                <TextInput type="number" className="mt-1 w-full" value={createForm.data.duration_months} onChange={(event) => createForm.setData('duration_months', event.target.value)} />
                            </div>
                            <div>
                                <InputLabel value={hasVariations ? t('membership_packages.normal_price') : t('membership_packages.price')} />
                                <TextInput type="number" step="0.01" className="mt-1 w-full" value={createForm.data.price} onChange={(event) => createForm.setData('price', event.target.value)} />
                            </div>
                            {variations.map((variation) => (
                                <div key={variation.id}>
                                    <InputLabel value={`${variationHeading(variation, t)} (₺)`} />
                                    <TextInput type="number" step="0.01" className="mt-1 w-full" placeholder="—" value={createForm.data.variation_prices[variation.id] ?? ''} onChange={(event) => setVariationPrice(createForm, variation.id, event.target.value)} />
                                </div>
                            ))}
                            <label className="flex items-end gap-2 pb-2 text-sm text-zinc-700">
                                <Checkbox checked={createForm.data.is_active} onChange={(event) => createForm.setData('is_active', event.target.checked)} />
                                {t('common.active')}
                            </label>
                            <div className="flex items-end">
                                <Button type="submit" disabled={createForm.processing}>{t('common.create')}</Button>
                            </div>
                        </div>
                    </Panel>
                </form>
            )}

            <div className="mt-6 overflow-x-auto rounded-2xl border border-zinc-200/80 bg-white shadow-sm">
                <table className="w-full text-sm">
                    <thead className="bg-zinc-50 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                        <tr>
                            <th className="px-4 py-3">{t('membership_packages.duration')}</th>
                            <th className="px-4 py-3">{hasVariations ? t('membership_packages.normal_price') : t('membership_packages.price')}</th>
                            {variations.map((variation) => <th key={variation.id} className="px-4 py-3">{variationHeading(variation, t)}</th>)}
                            <th className="px-4 py-3">{t('common.status')}</th>
                            <th className="px-4 py-3">{t('common.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {packages.length === 0 && (
                            <tr><td colSpan={4 + variations.length} className="px-4 py-12 text-center text-zinc-500">{t('common.empty')}</td></tr>
                        )}
                        {packages.map((pkg) => (
                            <tr key={pkg.id} className={`border-t border-zinc-100 ${editingId === pkg.id ? 'bg-orange-50/70' : 'hover:bg-zinc-50'}`}>
                                {editingId === pkg.id ? (
                                    <>
                                        <td className="px-4 py-3"><TextInput type="number" className="w-20" value={editForm.data.duration_months} onChange={(event) => editForm.setData('duration_months', event.target.value)} /></td>
                                        <td className="px-4 py-3"><TextInput type="number" step="0.01" className="w-28" value={editForm.data.price} onChange={(event) => editForm.setData('price', event.target.value)} /></td>
                                        {variations.map((variation) => (
                                            <td key={variation.id} className="px-4 py-3">
                                                <TextInput type="number" step="0.01" className="w-28" placeholder="—" value={editForm.data.variation_prices[variation.id] ?? ''} onChange={(event) => setVariationPrice(editForm, variation.id, event.target.value)} />
                                            </td>
                                        ))}
                                        <td className="px-4 py-3"><Checkbox checked={editForm.data.is_active} onChange={(event) => editForm.setData('is_active', event.target.checked)} /></td>
                                        <td className="px-4 py-3">
                                            <Button type="button" size="sm" onClick={() => editForm.put(route('membership-packages.update', pkg.id), { onSuccess: () => setEditingId(null) })}>{t('common.save')}</Button>
                                            <Button type="button" variant="ghost" size="sm" onClick={() => setEditingId(null)}>{t('common.cancel')}</Button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td className="px-4 py-3 font-medium text-zinc-950">{durationLabel(t, pkg.duration_months)}</td>
                                        <td className="px-4 py-3">₺{Number(pkg.price).toLocaleString('tr-TR')}</td>
                                        {variations.map((variation) => {
                                            const amount = pkg.variation_prices?.[variation.id];
                                            return <td key={variation.id} className="px-4 py-3">{amount == null ? '—' : `₺${Number(amount).toLocaleString('tr-TR')}`}</td>;
                                        })}
                                        <td className="px-4 py-3"><Badge tone={pkg.is_active ? 'success' : 'neutral'}>{pkg.is_active ? t('common.active') : t('common.inactive')}</Badge></td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <Button type="button" variant="ghost" size="sm" onClick={() => startEdit(pkg)}>{t('common.edit')}</Button>
                                            <Button type="button" variant="danger" size="sm" onClick={() => confirmDelete(t('common.confirm_delete')) && router.delete(route('membership-packages.destroy', pkg.id))}>{t('common.delete')}</Button>
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
