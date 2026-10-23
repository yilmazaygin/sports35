export default function AlertBanner({ alert, variant = 'overlay', className = '' }) {
    if (!alert?.message) {
        return null;
    }

    if (variant === 'hours') {
        return (
            <p className={`rounded-xl border border-brand-orange/35 bg-brand-black/50 px-5 py-3.5 text-center text-sm font-medium leading-relaxed text-white ${className}`}>
                {alert.message}
            </p>
        );
    }

    return (
        <div className={`relative z-20 flex justify-center px-4 pt-4 lg:pt-[calc(5.25rem+env(safe-area-inset-top))] ${className}`}>
            <p className="max-w-2xl rounded-2xl border border-white/15 bg-black/45 px-4 py-2.5 text-center text-sm font-medium leading-relaxed text-white shadow-lg shadow-black/25 backdrop-blur-md sm:px-5 lg:rounded-full lg:py-2 lg:leading-snug">
                {alert.message}
            </p>
        </div>
    );
}
