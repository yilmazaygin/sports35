import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';
import { useTranslation } from '@/hooks/useTranslation';
import Sports35Logo from '@/Components/Public/Sports35Logo';

export default function Login({ status }) {
    const { t } = useTranslation('admin');
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-brand-black px-4">
            <Head title={t('login.title')} />

            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <Sports35Logo className="mx-auto h-24 w-[280px]" />
                    <p className="mt-2 text-sm text-zinc-400">{t('login.subtitle')}</p>
                </div>

                {status && (
                    <div className="mb-4 text-sm font-medium text-green-400">{status}</div>
                )}

                <form
                    onSubmit={submit}
                    className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 shadow-xl"
                >
                    <div>
                        <InputLabel htmlFor="email" value={t('login.email')} className="text-zinc-300" />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full border-zinc-700 bg-zinc-800 text-white focus:border-brand-red focus:ring-brand-red"
                            autoComplete="username"
                            isFocused={true}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="password" value={t('login.password')} className="text-zinc-300" />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full border-zinc-700 bg-zinc-800 text-white focus:border-brand-red focus:ring-brand-red"
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div className="mt-4 block">
                        <label className="flex items-center">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                            />
                            <span className="ms-2 text-sm text-zinc-400">{t('login.remember')}</span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="mt-6 w-full rounded-lg bg-brand-red px-4 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-red-dark focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50"
                    >
                        {t('login.submit')}
                    </button>
                </form>
            </div>
        </div>
    );
}
