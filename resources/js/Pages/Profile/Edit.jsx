import AdminLayout from '@/Layouts/AdminLayout';
import { PageHeader, Panel } from '@/Components/Admin/ui';
import { Head } from '@inertiajs/react';
import { useTranslation } from '@/hooks/useTranslation';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    const { t } = useTranslation('admin');

    return (
        <AdminLayout header={<PageHeader title={t('nav.account')} description={t('profile.subtitle')} />}>
            <Head title={t('nav.account')} />

            <div className="max-w-3xl space-y-6">
                <Panel>
                    <UpdateProfileInformationForm mustVerifyEmail={mustVerifyEmail} status={status} />
                </Panel>
                <Panel>
                    <UpdatePasswordForm />
                </Panel>
                <Panel>
                    <DeleteUserForm />
                </Panel>
            </div>
        </AdminLayout>
    );
}
