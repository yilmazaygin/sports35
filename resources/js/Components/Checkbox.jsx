export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-zinc-300 text-brand-red shadow-sm focus:ring-brand-red ' +
                className
            }
        />
    );
}
