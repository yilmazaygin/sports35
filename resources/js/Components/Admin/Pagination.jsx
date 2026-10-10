import { Link } from '@inertiajs/react';

export default function Pagination({ links = [] }) {
    if (!links.length || links.length <= 3) return null;
    return <nav className="mt-5 flex flex-wrap gap-1" aria-label="Pagination">{links.map((link, index) => link.url ? <Link key={index} href={link.url} preserveScroll className={`rounded border px-3 py-1 text-sm ${link.active ? 'border-brand-red bg-brand-red text-white' : 'border-zinc-200 bg-white text-zinc-700'}`} dangerouslySetInnerHTML={{ __html: link.label }} /> : <span key={index} className="rounded border border-zinc-100 px-3 py-1 text-sm text-zinc-400" dangerouslySetInnerHTML={{ __html: link.label }} />)}</nav>;
}
