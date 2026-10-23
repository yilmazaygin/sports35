import { useState } from 'react';

const buttonSizes = {
    md: 'px-3.5 py-2',
    sm: 'px-2.5 py-1.5',
};

const buttonVariants = {
    primary: 'bg-brand-red text-white shadow-sm hover:bg-brand-red-dark',
    secondary: 'border border-zinc-300 bg-white text-zinc-800 shadow-sm hover:bg-zinc-50',
    ghost: 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950',
    danger: 'text-red-700 hover:bg-red-50',
};

export function buttonClass(variant = 'primary', size = 'md', className = '') {
    return [
        'inline-flex items-center justify-center gap-2 rounded-lg text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red disabled:cursor-not-allowed disabled:opacity-50',
        buttonSizes[size],
        buttonVariants[variant],
        className,
    ].filter(Boolean).join(' ');
}

export function Button({
    variant = 'primary',
    size = 'md',
    className = '',
    type = 'button',
    ...props
}) {
    return <button type={type} className={buttonClass(variant, size, className)} {...props} />;
}

export function PageHeader({ title, description, actions }) {
    return (
        <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0 max-w-3xl">
                <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">{title}</h1>
                {description && <p className="mt-1.5 text-sm leading-6 text-zinc-500">{description}</p>}
            </div>
            {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
        </div>
    );
}

export function Panel({ children, className = '', padded = true }) {
    return (
        <section className={`rounded-2xl border border-zinc-200/80 bg-white shadow-sm ${padded ? 'p-5 sm:p-6' : ''} ${className}`}>
            {children}
        </section>
    );
}

const badgeTones = {
    success: 'bg-emerald-50 text-emerald-800 ring-emerald-600/15',
    neutral: 'bg-zinc-100 text-zinc-600 ring-zinc-500/10',
    warning: 'bg-amber-50 text-amber-900 ring-amber-600/15',
    brand: 'bg-orange-50 text-brand-red-dark ring-brand-red/15',
};

export function Badge({ children, tone = 'neutral' }) {
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${badgeTones[tone]}`}>
            {children}
        </span>
    );
}

export function Empty({ children }) {
    return (
        <p className="rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-14 text-center text-sm text-zinc-500">
            {children}
        </p>
    );
}

export function FormErrors({ errors, className = '' }) {
    const messages = Object.entries(errors || {}).flatMap(([, message]) => {
        if (typeof message === 'string' && message !== '') {
            return [message];
        }
        if (Array.isArray(message)) {
            return message.map(String).filter(Boolean);
        }
        return [];
    });

    if (!messages.length) {
        return null;
    }

    return (
        <div role="alert" className={`mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 ${className}`}>
            <ul className="space-y-1">
                {messages.map((message, index) => <li key={`${message}-${index}`}>{message}</li>)}
            </ul>
        </div>
    );
}

export function FilterBar({ onSubmit, children }) {
    return (
        <form onSubmit={onSubmit} className="flex flex-wrap items-end gap-3 rounded-2xl border border-zinc-200/80 bg-white p-3 shadow-sm">
            {children}
        </form>
    );
}

export function FilterField({ label, children }) {
    return (
        <label className="block min-w-[11rem] flex-1 text-xs font-semibold text-zinc-500">
            {label}
            <div className="mt-1.5">{children}</div>
        </label>
    );
}

export function Toggle({ checked, onClick, label }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            aria-label={label}
            onClick={onClick}
            className={`relative h-7 w-12 shrink-0 rounded-full transition ${checked ? 'bg-brand-red' : 'bg-zinc-300'}`}
        >
            <span className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow transition ${checked ? 'translate-x-5' : ''}`} />
        </button>
    );
}

export function useComposer(form) {
    const [wanted, setWanted] = useState(false);
    const hasErrors = Object.keys(form?.errors || {}).length > 0;
    const open = wanted || hasErrors;

    const close = () => {
        form?.clearErrors?.();
        setWanted(false);
    };

    const toggle = () => {
        if (open) {
            close();
            return;
        }
        setWanted(true);
    };

    return { open, toggle, close, show: () => setWanted(true) };
}

export const thClass = 'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500';
export const tdClass = 'px-4 py-3 align-middle text-zinc-700';
