import { Link } from '@inertiajs/react';

function cleanLabel(label) {
    return label
        .replace(/&laquo;|&raquo;|‹|›/g, '')
        .replace(/<[^>]*>/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

export default function Pagination({ links = [] }) {
    if (!links.length || links.length <= 3) {
        return null;
    }

    return (
        <nav className="mt-6 flex flex-wrap items-center justify-end gap-1" aria-label="Pagination">
            {links.map((link, index) => {
                const label = cleanLabel(link.label);
                const className = `min-w-9 rounded-lg px-3 py-1.5 text-center text-sm font-medium ${link.active ? 'bg-zinc-950 text-white' : 'bg-white text-zinc-700 ring-1 ring-zinc-200 hover:bg-zinc-50'}`;

                if (!link.url) {
                    return (
                        <span key={index} className="min-w-9 rounded-lg px-3 py-1.5 text-center text-sm text-zinc-400">
                            {label}
                        </span>
                    );
                }

                return (
                    <Link key={index} href={link.url} preserveScroll className={className}>
                        {label}
                    </Link>
                );
            })}
        </nav>
    );
}
