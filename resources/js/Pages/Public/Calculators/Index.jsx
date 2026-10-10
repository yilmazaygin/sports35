import PublicLayout from '@/Layouts/PublicLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import {
    calculateCalorieTarget,
    calculateMacros,
    CalculatorInputError,
} from '@/utils/calculators';

export default function Index() {
    const { t } = useTranslation();

    const [calorieForm, setCalorieForm] = useState({
        gender: 'male', age: 25, weight: 75, height: 175, activity: 'medium',
    });
    const [calorieResult, setCalorieResult] = useState(null);

    const [macroForm, setMacroForm] = useState({ weight: 75, calories: 2400, goal: 'maintain' });
    const [macroResult, setMacroResult] = useState(null);
    const [calorieError, setCalorieError] = useState(false);
    const [macroError, setMacroError] = useState(false);

    const handleCalculateCalories = (e) => {
        e.preventDefault();
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

    const handleCalculateMacros = (e) => {
        e.preventDefault();
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

    return (
        <PublicLayout>
            <Head title={t('calculators_page.title')} />

            <section className="bg-brand-black py-12 md:py-16">
                <div className="mx-auto max-w-6xl px-4">
                    <div className="mb-12 text-center">
                        <h1 className="text-3xl font-black uppercase text-white sm:text-4xl">{t('calculators_page.title')}</h1>
                        <p className="mt-3 text-zinc-400">{t('calculators_page.subtitle')}</p>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-2">
                        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                            <h2 className="mb-6 text-xl font-bold text-white">{t('calculators_page.calorie.title')}</h2>
                            <form onSubmit={handleCalculateCalories} className="space-y-4" noValidate>
                                <div>
                                    <label htmlFor="calorie-gender" className="text-sm text-zinc-400">{t('calculators_page.calorie.gender')}</label>
                                    <select className="mt-1 w-full rounded-lg border-zinc-700 bg-zinc-800 text-white"
                                        id="calorie-gender"
                                        value={calorieForm.gender} onChange={(e) => setCalorieForm({ ...calorieForm, gender: e.target.value })}>
                                        <option value="male">{t('calculators_page.calorie.male')}</option>
                                        <option value="female">{t('calculators_page.calorie.female')}</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label htmlFor="calorie-age" className="text-sm text-zinc-400">{t('calculators_page.calorie.age')}</label>
                                        <input id="calorie-age" min="13" max="100" step="1" required type="number" className="mt-1 w-full rounded-lg border-zinc-700 bg-zinc-800 text-white"
                                            value={calorieForm.age} onChange={(e) => setCalorieForm({ ...calorieForm, age: e.target.value })} />
                                    </div>
                                    <div>
                                        <label htmlFor="calorie-weight" className="text-sm text-zinc-400">{t('calculators_page.calorie.weight')}</label>
                                        <input id="calorie-weight" min="25" max="300" step="0.1" required type="number" className="mt-1 w-full rounded-lg border-zinc-700 bg-zinc-800 text-white"
                                            value={calorieForm.weight} onChange={(e) => setCalorieForm({ ...calorieForm, weight: e.target.value })} />
                                    </div>
                                    <div>
                                        <label htmlFor="calorie-height" className="text-sm text-zinc-400">{t('calculators_page.calorie.height')}</label>
                                        <input id="calorie-height" min="100" max="250" step="0.1" required type="number" className="mt-1 w-full rounded-lg border-zinc-700 bg-zinc-800 text-white"
                                            value={calorieForm.height} onChange={(e) => setCalorieForm({ ...calorieForm, height: e.target.value })} />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="calorie-activity" className="text-sm text-zinc-400">{t('calculators_page.calorie.activity')}</label>
                                    <select className="mt-1 w-full rounded-lg border-zinc-700 bg-zinc-800 text-white"
                                        id="calorie-activity"
                                        value={calorieForm.activity} onChange={(e) => setCalorieForm({ ...calorieForm, activity: e.target.value })}>
                                        <option value="low">{t('calculators_page.calorie.activity_low')}</option>
                                        <option value="medium">{t('calculators_page.calorie.activity_medium')}</option>
                                        <option value="high">{t('calculators_page.calorie.activity_high')}</option>
                                    </select>
                                </div>
                                <button type="submit" className="w-full rounded-lg bg-brand-red py-3 font-bold text-white hover:bg-brand-red-dark">
                                    {t('calculators_page.calorie.calculate')}
                                </button>
                            </form>
                            {calorieError && <p role="alert" className="mt-4 text-sm text-red-400">{t('calculators_page.errors.invalid')}</p>}
                            {calorieResult && (
                                <div aria-live="polite" className="mt-6 rounded-lg border border-brand-red/30 bg-brand-red/10 p-4">
                                    <p className="font-bold text-brand-red">{t('calculators_page.calorie.result_title')}</p>
                                    <p className="mt-2 text-white">{t('calculators_page.calorie.result', { calories: calorieResult.calories })}</p>
                                    <p className="mt-1 text-sm text-zinc-300">{t('calculators_page.calorie.bmr_result', { bmr: calorieResult.bmr })}</p>
                                    <p className="mt-2 text-xs text-zinc-500">{t('calculators_page.calorie.result_note')}</p>
                                </div>
                            )}
                        </div>

                        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                            <h2 className="mb-6 text-xl font-bold text-white">{t('calculators_page.macro.title')}</h2>
                            <form onSubmit={handleCalculateMacros} className="space-y-4" noValidate>
                                <div>
                                    <label htmlFor="macro-weight" className="text-sm text-zinc-400">{t('calculators_page.macro.weight')}</label>
                                    <input id="macro-weight" min="25" max="300" step="0.1" required type="number" className="mt-1 w-full rounded-lg border-zinc-700 bg-zinc-800 text-white"
                                        value={macroForm.weight} onChange={(e) => setMacroForm({ ...macroForm, weight: e.target.value })} />
                                </div>
                                <div>
                                    <label htmlFor="macro-calories" className="text-sm text-zinc-400">{t('calculators_page.macro.calories')}</label>
                                    <input id="macro-calories" min="1000" max="6000" step="50" required type="number" className="mt-1 w-full rounded-lg border-zinc-700 bg-zinc-800 text-white"
                                        value={macroForm.calories} onChange={(e) => setMacroForm({ ...macroForm, calories: e.target.value })} />
                                </div>
                                <div>
                                    <label htmlFor="macro-goal" className="text-sm text-zinc-400">{t('calculators_page.macro.goal')}</label>
                                    <select className="mt-1 w-full rounded-lg border-zinc-700 bg-zinc-800 text-white"
                                        id="macro-goal"
                                        value={macroForm.goal} onChange={(e) => setMacroForm({ ...macroForm, goal: e.target.value })}>
                                        <option value="cut">{t('calculators_page.macro.goal_cut')}</option>
                                        <option value="maintain">{t('calculators_page.macro.goal_maintain')}</option>
                                        <option value="bulk">{t('calculators_page.macro.goal_bulk')}</option>
                                    </select>
                                </div>
                                <button type="submit" className="w-full rounded-lg bg-brand-red py-3 font-bold text-white hover:bg-brand-red-dark">
                                    {t('calculators_page.macro.calculate')}
                                </button>
                            </form>
                            {macroError && <p role="alert" className="mt-4 text-sm text-red-400">{t('calculators_page.errors.invalid')}</p>}
                            {macroResult && (
                                <div aria-live="polite" className="mt-6 rounded-lg border border-brand-red/30 bg-brand-red/10 p-4">
                                    <p className="font-bold text-brand-red">{t('calculators_page.macro.result_title')}</p>
                                    <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                                        <div>
                                            <p className="text-2xl font-black text-white">{macroResult.protein}g</p>
                                            <p className="text-xs text-zinc-500">{t('calculators_page.macro.protein')}</p>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-black text-white">{macroResult.carbs}g</p>
                                            <p className="text-xs text-zinc-500">{t('calculators_page.macro.carbs')}</p>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-black text-white">{macroResult.fat}g</p>
                                            <p className="text-xs text-zinc-500">{t('calculators_page.macro.fat')}</p>
                                        </div>
                                    </div>
                                    <p className="mt-4 text-xs text-zinc-500">{t('calculators_page.macro.result_note')}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
