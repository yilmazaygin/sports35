import logoUrl from '@/../images/brand/sports35-logo.png';

export default function Sports35Logo({ className = 'h-10 w-auto', ...props }) {
    return (
        <img
            src={logoUrl}
            alt="Sports35"
            className={`object-contain object-center ${className}`}
            {...props}
        />
    );
}
