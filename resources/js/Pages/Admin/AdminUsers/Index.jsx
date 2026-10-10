import { Head, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import FlashMessage from '@/Components/Admin/FlashMessage';
import { useTranslation } from '@/hooks/useTranslation';

export default function Index({ users, roles }) {
    const { t } = useTranslation('admin');
    const { errors } = usePage().props;
    const create = useForm({ name: '', email: '', role: 'manager', password: '', password_confirmation: '' });

    const submit = (event) => {
        event.preventDefault();
        create.post(route('admin-users.store'), { onSuccess: () => create.reset() });
    };

    return (
        <AdminLayout header={<h1 className="text-2xl font-bold text-zinc-900">{t('users.title')}</h1>}>
            <Head title={t('users.title')} />
            <FlashMessage />
            <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
                <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                    <div className="divide-y divide-zinc-100">
                        {users.map((user) => <UserRow key={user.id} user={user} roles={roles} />)}
                    </div>
                </div>
                <form onSubmit={submit} className="space-y-4 rounded-xl bg-white p-5 shadow-sm">
                    <h2 className="font-semibold text-zinc-900">{t('users.add')}</h2>
                    <input className="w-full rounded-lg border-zinc-300" placeholder={t('users.name')} value={create.data.name} onChange={(e) => create.setData('name', e.target.value)} />
                    <input className="w-full rounded-lg border-zinc-300" type="email" placeholder={t('users.email')} value={create.data.email} onChange={(e) => create.setData('email', e.target.value)} />
                    <select className="w-full rounded-lg border-zinc-300" value={create.data.role} onChange={(e) => create.setData('role', e.target.value)}>{roles.map((role) => <option key={role} value={role}>{t(`users.roles.${role}`)}</option>)}</select>
                    <input className="w-full rounded-lg border-zinc-300" type="password" placeholder={t('users.password')} value={create.data.password} onChange={(e) => create.setData('password', e.target.value)} />
                    <input className="w-full rounded-lg border-zinc-300" type="password" placeholder={t('users.password_confirmation')} value={create.data.password_confirmation} onChange={(e) => create.setData('password_confirmation', e.target.value)} />
                    {Object.values(errors ?? {}).map((error) => <p key={error} className="text-sm text-red-600">{error}</p>)}
                    <button className="rounded-lg bg-brand-red px-4 py-2 font-medium text-white" disabled={create.processing}>{t('common.create')}</button>
                </form>
            </div>
        </AdminLayout>
    );
}

function UserRow({ user, roles }) {
    const { t } = useTranslation('admin');
    const form = useForm({ name: user.name, email: user.email, role: user.role, is_active: user.is_active, password: '', password_confirmation: '' });
    return <form onSubmit={(event) => { event.preventDefault(); form.put(route('admin-users.update', user.id)); }} className="grid gap-3 p-4 md:grid-cols-[1.2fr_1.5fr_1fr_auto] md:items-center">
        <div><input className="w-full rounded border-zinc-300 text-sm" value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} /><span className="text-xs text-zinc-500">{user.email}</span></div>
        <input className="rounded border-zinc-300 text-sm" type="email" value={form.data.email} onChange={(e) => form.setData('email', e.target.value)} />
        <select className="rounded border-zinc-300 text-sm" value={form.data.role} onChange={(e) => form.setData('role', e.target.value)}>{roles.map((role) => <option key={role} value={role}>{t(`users.roles.${role}`)}</option>)}</select>
        <div className="flex items-center gap-3"><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.data.is_active} onChange={(e) => form.setData('is_active', e.target.checked)} />{t('common.active')}</label><button className="rounded bg-zinc-900 px-3 py-2 text-sm text-white">{t('common.save')}</button></div>
    </form>;
}
