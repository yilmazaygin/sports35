import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

export default function BeforeAfterSlider({ item }) {
    const { t } = useTranslation();
    const [pos, setPos] = useState(50);

    return (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 md:p-6">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">{item.name}</h2>
                {item.duration && (
                    <span className="rounded-full bg-brand-red/10 px-3 py-1 text-sm font-medium text-brand-red">
                        {item.duration}
                    </span>
                )}
            </div>

            <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-zinc-800">
                <img src={item.after_url} alt={`${t('transformations_page.after')}: ${item.name}`} className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
                    <img
                        src={item.before_url}
                        alt={`${t('transformations_page.before')}: ${item.name}`}
                        className="h-full max-w-none object-cover"
                        style={{ width: `${pos > 0 ? (100 / pos) * 100 : 100}%` }}
                    />
                </div>
                <div
                    className="absolute bottom-0 top-0 w-1 bg-white shadow-lg"
                    style={{ left: `${pos}%`, transform: 'translateX(-50%)' }}
                />
                <input
                    type="range"
                    min="5"
                    max="95"
                    value={pos}
                    onChange={(e) => setPos(Number(e.target.value))}
                    className="absolute inset-x-4 bottom-4 z-10 w-[calc(100%-2rem)] accent-brand-red opacity-0"
                />
                <div className="pointer-events-none absolute left-4 top-4 rounded bg-black/60 px-2 py-1 text-xs font-bold uppercase">
                    {t('transformations_page.before')}
                </div>
                <div className="pointer-events-none absolute right-4 top-4 rounded bg-brand-red/80 px-2 py-1 text-xs font-bold uppercase">
                    {t('transformations_page.after')}
                </div>
            </div>

            {item.description && (
                <p className="mt-4 text-sm leading-relaxed text-zinc-400">{item.description}</p>
            )}
        </div>
    );
}
