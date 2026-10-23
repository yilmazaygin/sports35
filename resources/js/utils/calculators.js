export const CALCULATOR_LIMITS = Object.freeze({
    age: { min: 13, max: 100 },
    weight: { min: 25, max: 300 },
    height: { min: 100, max: 250 },
    calories: { min: 1000, max: 6000 },
});

const ACTIVITY_FACTORS = Object.freeze({
    low: 1.2,
    medium: 1.55,
    high: 1.725,
});

/** Cut below maintenance calories. */
export const WEIGHT_LOSS_PERCENT = 20;

const PROTEIN_FACTORS = Object.freeze({
    cut: 2,
    maintain: 1.6,
    bulk: 1.8,
});

export class CalculatorInputError extends Error {
    constructor(message = 'Invalid calculator input') {
        super(message);
        this.name = 'CalculatorInputError';
    }
}

function numberInRange(value, { min, max }) {
    const number = Number(value);

    if (!Number.isFinite(number) || number < min || number > max) {
        throw new CalculatorInputError();
    }

    return number;
}

function requiredChoice(value, choices) {
    if (!choices.includes(value)) {
        throw new CalculatorInputError();
    }

    return value;
}

/**
 * Mifflin-St Jeor BMR multiplied by a conservative activity factor.
 * `calories` maintains weight; `loss` is that total minus WEIGHT_LOSS_PERCENT.
 * Inputs use kilograms and centimetres; output is kcal/day.
 */
export function calculateCalorieTarget({ gender, age, weight, height, activity }) {
    const validGender = requiredChoice(gender, ['male', 'female']);
    const validActivity = requiredChoice(activity, Object.keys(ACTIVITY_FACTORS));
    const validAge = numberInRange(age, CALCULATOR_LIMITS.age);
    const validWeight = numberInRange(weight, CALCULATOR_LIMITS.weight);
    const validHeight = numberInRange(height, CALCULATOR_LIMITS.height);

    const bmr = (10 * validWeight)
        + (6.25 * validHeight)
        - (5 * validAge)
        + (validGender === 'male' ? 5 : -161);
    const calories = bmr * ACTIVITY_FACTORS[validActivity];

    if (!Number.isFinite(bmr) || !Number.isFinite(calories) || calories <= 0) {
        throw new CalculatorInputError();
    }

    const maintenance = Math.round(calories);
    const loss = Math.round(maintenance * (1 - WEIGHT_LOSS_PERCENT / 100));

    if (!Number.isFinite(loss) || loss <= 0) {
        throw new CalculatorInputError();
    }

    return {
        bmr: Math.round(bmr),
        calories: maintenance,
        loss,
        activityFactor: ACTIVITY_FACTORS[validActivity],
    };
}

/**
 * Protein is based on goal-specific grams/kg, fat on 0.8 g/kg, and carbs
 * consume the remaining calories (4/4/9 kcal per gram for P/C/F).
 */
export function calculateMacros({ weight, calories, goal }) {
    const validGoal = requiredChoice(goal, Object.keys(PROTEIN_FACTORS));
    const validWeight = numberInRange(weight, CALCULATOR_LIMITS.weight);
    const validCalories = numberInRange(calories, CALCULATOR_LIMITS.calories);

    const protein = Math.round(validWeight * PROTEIN_FACTORS[validGoal]);
    const fat = Math.round(validWeight * 0.8);
    const remainingCalories = validCalories - (protein * 4) - (fat * 9);

    if (remainingCalories < 80) {
        throw new CalculatorInputError();
    }

    const carbs = Math.round(remainingCalories / 4);

    if (!Number.isFinite(protein) || !Number.isFinite(fat) || !Number.isFinite(carbs) || carbs < 20) {
        throw new CalculatorInputError();
    }

    return { protein, carbs, fat, calories: Math.round(validCalories) };
}
