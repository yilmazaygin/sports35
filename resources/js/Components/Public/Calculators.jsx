import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import {
    calculateCalorieTarget,
    calculateMacros,
    CalculatorInputError,
    WEIGHT_LOSS_PERCENT,
} from '@/utils/calculators';

const fieldClass = 'mt-1 w-full rounded-lg border-zinc-700 bg-zinc-800 text-white';
const metricValueClass = 'mt-2 flex items-baseline gap-2 whitespace-nowrap text-3xl font-black leading-none tracking-tight text-white tabular-nums sm:text-4xl';

function nextStep(value, delta, { min, max, step }) {
    const current = value === '' ? Number.NaN : Number(value);

    if (!Number.isFinite(current)) {
        return String(min);
    }

    const next = Math.min(max, Math.max(min, Math.round(current + delta * step)));

    if (next === current) {
        return null;
    }

    return String(next);
}

function MinusIcon() {
    return (
        <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden="true">
            <path d="M3 8h10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}

function PlusIcon() {
    return (
        <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden="true">
            <path d="M8 3v10M3 8h10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}

function Stepper({ id, label, value, min, max, step = 1, onValue, decreaseLabel, increaseLabel }) {
    const numeric = value === '' ? Number.NaN : Number(value);
    const atMin = !Number.isFinite(numeric) || numeric <= min;
    const atMax = Number.isFinite(numeric) && numeric >= max;
    const buttonClass = 'flex w-9 shrink-0 items-center justify-center border-l border-zinc-700 text-zinc-200 hover:bg-zinc-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-30';

    const change = (delta) => {
        const next = nextStep(value, delta, { min, max, step });

        if (next !== null) {
            onValue(next);
        }
    };

    return (
        <div>
            <label htmlFor={id} className="text-sm text-zinc-400">{label}</label>
            <div className="mt-1 flex h-10 overflow-hidden rounded-lg border border-zinc-700 bg-zinc-800 focus-within:border-brand-red focus-within:ring-1 focus-within:ring-brand-red">
                <input
                    id={id}
                    inputMode="numeric"
                    autoComplete="off"
                    value={value}
                    onChange={(event) => onValue(event.target.value.replace(/\D/g, ''))}
                    className="h-full min-w-0 flex-1 border-0 bg-transparent px-3 text-white shadow-none tabular-nums focus:ring-0"
                />
                <button type="button" className={buttonClass} onClick={() => change(-1)} disabled={atMin} aria-label={`${decreaseLabel}: ${label}`}>
                    <MinusIcon />
                </button>
                <button type="button" className={buttonClass} onClick={() => change(1)} disabled={atMax} aria-label={`${increaseLabel}: ${label}`}>
                    <PlusIcon />
                </button>
            </div>
        </div>
    );
}

function CalculatorHeading({ title, disclaimer }) {
    return (
        <div className="flex flex-col items-start gap-1 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-2 sm:gap-y-0.5">
            <h2 className="text-xl font-bold text-white">{title}</h2>
            <p className="text-xs text-zinc-400">({disclaimer})</p>
        </div>
    );
}

function ResultPanel({ children }) {
    return (
        <div
            className="flex flex-col justify-center py-2 md:col-start-2 md:row-span-2 md:row-start-1 md:px-4 md:py-0"
            style={{ overflowAnchor: 'none' }}
        >
            <div aria-live="polite">{children}</div>
        </div>
    );
}

function Metric({ label, value, unit }) {
    return (
        <div>
            <p className="text-sm font-medium text-zinc-400">{label}:</p>
            <p className={metricValueClass}>
                <span>{value}</span>
                {unit ? <span className="text-sm font-medium text-zinc-400">{unit}</span> : null}
            </p>
        </div>
    );
}

export default function Calculators() {
    const { t, locale } = useTranslation();
    const formatNumber = (value) => new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'tr-TR').format(value);
    const decreaseLabel = t('calculators_page.decrease');
    const increaseLabel = t('calculators_page.increase');

    const [calorieForm, setCalorieForm] = useState({
        gender: 'male', age: '25', weight: '75', height: '175', activity: 'medium',
    });
    const [calorieResult, setCalorieResult] = useState(null);

    const [macroForm, setMacroForm] = useState({ weight: '75', calories: '2400', goal: 'maintain' });
    const [macroResult, setMacroResult] = useState(null);
    const [calorieError, setCalorieError] = useState(false);
    const [macroError, setMacroError] = useState(false);

    const setCalorieField = (key, value) => {
        setCalorieForm((current) => ({ ...current, [key]: value }));
        setCalorieResult(null);
        setCalorieError(false);
    };

    const setMacroField = (key, value) => {
        setMacroForm((current) => ({ ...current, [key]: value }));
        setMacroResult(null);
        setMacroError(false);
    };

    const handleCalculateCalories = (event) => {
        event.preventDefault();
        try {
            setCalorieResult(calculateCalorieTarget(calorieForm));
            setCalorieError(false);
        } catch (error) {
            if (error instanceof CalculatorInputError) {
                setCalorieResult(null);
                setCalorieError(true);
            } else {
                throw error;
            }
        }
    };

    const handleCalculateMacros = (event) => {
        event.preventDefault();
        try {
            setMacroResult(calculateMacros(macroForm));
            setMacroError(false);
        } catch (error) {
            if (error instanceof CalculatorInputError) {
                setMacroResult(null);
                setMacroError(true);
            } else {
                throw error;
            }
        }
    };

    const calorieValue = (key) => (calorieResult ? formatNumber(calorieResult[key]) : '—');
    const macroValue = (key) => (macroResult ? `${macroResult[key]}g` : '—');

    return (
        <section id="calculators" className="scroll-mt-28 border-t border-brand-red bg-brand-black py-16 md:py-24" style={{ overflowAnchor: 'none' }}>
            <div className="mx-auto max-w-6xl px-4">
                <div className="mb-10 text-center">
                    <h2 className="text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl">{t('calculators_page.title')}</h2>
                    <p className="mt-3 text-zinc-400">{t('calculators_page.subtitle')}</p>
                </div>

                <div className="grid gap-6">
                    <article className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                        <CalculatorHeading title={t('calculators_page.calorie.title')} disclaimer={t('calculators_page.disclaimer')} />
                        <form
                            onSubmit={handleCalculateCalories}
                            className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_minmax(18rem,22rem)] md:items-stretch"
                            noValidate
                        >
                            <div className="space-y-4 md:col-start-1 md:row-start-1">
                                <div>
                                    <label htmlFor="calorie-gender" className="text-sm text-zinc-400">{t('calculators_page.calorie.gender')}</label>
                                    <select
                                        className={fieldClass}
                                        id="calorie-gender"
                                        value={calorieForm.gender}
                                        onChange={(event) => setCalorieField('gender', event.target.value)}
                                    >
                                        <option value="male">{t('calculators_page.calorie.male')}</option>
                                        <option value="female">{t('calculators_page.calorie.female')}</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                                    <Stepper
                                        id="calorie-age"
                                        label={t('calculators_page.calorie.age')}
                                        value={calorieForm.age}
                                        min={13}
                                        max={100}
                                        onValue={(value) => setCalorieField('age', value)}
                                        decreaseLabel={decreaseLabel}
                                        increaseLabel={increaseLabel}
                                    />
                                    <Stepper
                                        id="calorie-weight"
                                        label={t('calculators_page.calorie.weight')}
                                        value={calorieForm.weight}
                                        min={25}
                                        max={300}
                                        onValue={(value) => setCalorieField('weight', value)}
                                        decreaseLabel={decreaseLabel}
                                        increaseLabel={increaseLabel}
                                    />
                                    <Stepper
                                        id="calorie-height"
                                        label={t('calculators_page.calorie.height')}
                                        value={calorieForm.height}
                                        min={100}
                                        max={250}
                                        onValue={(value) => setCalorieField('height', value)}
                                        decreaseLabel={decreaseLabel}
                                        increaseLabel={increaseLabel}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="calorie-activity" className="text-sm text-zinc-400">{t('calculators_page.calorie.activity')}</label>
                                    <select
                                        className={fieldClass}
                                        id="calorie-activity"
                                        value={calorieForm.activity}
                                        onChange={(event) => setCalorieField('activity', event.target.value)}
                                    >
                                        <option value="low">{t('calculators_page.calorie.activity_low')}</option>
                                        <option value="medium">{t('calculators_page.calorie.activity_medium')}</option>
                                        <option value="high">{t('calculators_page.calorie.activity_high')}</option>
                                    </select>
                                </div>
                                {calorieError && <p role="alert" className="text-sm text-red-400">{t('calculators_page.errors.invalid')}</p>}
                            </div>

                            <ResultPanel>
                                <div className="space-y-6">
                                    <Metric label={t('calculators_page.calorie.daily_label')} value={calorieValue('calories')} unit="kcal" />
                                    <Metric
                                        label={t('calculators_page.calorie.loss_label', { percent: WEIGHT_LOSS_PERCENT })}
                                        value={calorieValue('loss')}
                                        unit="kcal"
                                    />
                                    <div>
                                        <Metric label={t('calculators_page.calorie.bmr_label')} value={calorieValue('bmr')} unit="kcal" />
                                        <p className="mt-3 max-w-xs text-sm font-light leading-relaxed text-zinc-400">{t('calculators_page.calorie.bmr_caution')}</p>
                                    </div>
                                </div>
                            </ResultPanel>

                            <button type="submit" className="w-full rounded-lg bg-brand-red py-3 font-bold text-white hover:bg-brand-red-dark md:col-start-1 md:row-start-2">
                                {t('calculators_page.calorie.calculate')}
                            </button>
                        </form>
                    </article>

                    <article className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                        <CalculatorHeading title={t('calculators_page.macro.title')} disclaimer={t('calculators_page.disclaimer')} />
                        <form
                            onSubmit={handleCalculateMacros}
                            className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_minmax(18rem,22rem)] md:items-stretch"
                            noValidate
                        >
                            <div className="space-y-4 md:col-start-1 md:row-start-1">
                                <Stepper
                                    id="macro-weight"
                                    label={t('calculators_page.macro.weight')}
                                    value={macroForm.weight}
                                    min={25}
                                    max={300}
                                    onValue={(value) => setMacroField('weight', value)}
                                    decreaseLabel={decreaseLabel}
                                    increaseLabel={increaseLabel}
                                />
                                <Stepper
                                    id="macro-calories"
                                    label={t('calculators_page.macro.calories')}
                                    value={macroForm.calories}
                                    min={1000}
                                    max={6000}
                                    step={50}
                                    onValue={(value) => setMacroField('calories', value)}
                                    decreaseLabel={decreaseLabel}
                                    increaseLabel={increaseLabel}
                                />
                                <div>
                                    <label htmlFor="macro-goal" className="text-sm text-zinc-400">{t('calculators_page.macro.goal')}</label>
                                    <select
                                        className={fieldClass}
                                        id="macro-goal"
                                        value={macroForm.goal}
                                        onChange={(event) => setMacroField('goal', event.target.value)}
                                    >
                                        <option value="cut">{t('calculators_page.macro.goal_cut')}</option>
                                        <option value="maintain">{t('calculators_page.macro.goal_maintain')}</option>
                                        <option value="bulk">{t('calculators_page.macro.goal_bulk')}</option>
                                    </select>
                                </div>
                                {macroError && <p role="alert" className="text-sm text-red-400">{t('calculators_page.errors.invalid')}</p>}
                            </div>

                            <ResultPanel>
                                <div className="space-y-6">
                                    <Metric label={t('calculators_page.macro.protein')} value={macroValue('protein')} />
                                    <Metric label={t('calculators_page.macro.carbs')} value={macroValue('carbs')} />
                                    <Metric label={t('calculators_page.macro.fat')} value={macroValue('fat')} />
                                </div>
                            </ResultPanel>

                            <button type="submit" className="w-full rounded-lg bg-brand-red py-3 font-bold text-white hover:bg-brand-red-dark md:col-start-1 md:row-start-2">
                                {t('calculators_page.macro.calculate')}
                            </button>
                        </form>
                    </article>
                </div>
            </div>
        </section>
    );
}
