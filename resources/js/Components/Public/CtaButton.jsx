export default function CtaButton({
    children,
    href = '#',
    variant = 'primary',
    className = '',
    onClick,
    ...props
}) {
    const base =
        'inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-bold uppercase tracking-wide transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-black';

    const variants = {
        primary:
            'bg-brand-red text-white hover:bg-brand-red-dark focus:ring-brand-red',
        secondary:
            'border-2 border-white text-white hover:bg-white hover:text-brand-black focus:ring-white',
        outline:
            'border-2 border-brand-red text-brand-red hover:bg-brand-red hover:text-white focus:ring-brand-red',
    };

    return (
        <a href={href} className={`${base} ${variants[variant]} ${className}`} onClick={onClick} {...props}>
            {children}
        </a>
    );
}
