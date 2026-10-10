import test from 'node:test';
import assert from 'node:assert/strict';
import {
    calculateCalorieTarget,
    calculateMacros,
    CalculatorInputError,
} from '../../resources/js/utils/calculators.js';

test('calculates male Mifflin-St Jeor TDEE', () => {
    assert.deepEqual(
        calculateCalorieTarget({
            gender: 'male', age: 25, weight: 75, height: 175, activity: 'medium',
        }),
        { bmr: 1724, calories: 2672, activityFactor: 1.55 },
    );
});

test('calculates female Mifflin-St Jeor BMR and low activity TDEE', () => {
    assert.deepEqual(
        calculateCalorieTarget({
            gender: 'female', age: 30, weight: 60, height: 165, activity: 'low',
        }),
        { bmr: 1320, calories: 1584, activityFactor: 1.2 },
    );
});

test('calculates goal-aware macros from calorie budget', () => {
    assert.deepEqual(
        calculateMacros({ weight: 75, calories: 2400, goal: 'maintain' }),
        { protein: 120, carbs: 345, fat: 60, calories: 2400 },
    );
});

test('rejects missing, non-finite, and unrealistic calorie inputs', () => {
    for (const input of [
        { gender: 'male', age: 25, weight: 75, activity: 'medium' },
        { gender: 'male', age: 0, weight: 75, height: 175, activity: 'medium' },
        { gender: 'male', age: 25, weight: 'nope', height: 175, activity: 'medium' },
        { gender: 'male', age: 25, weight: 75, height: 175, activity: 'unknown' },
    ]) {
        assert.throws(() => calculateCalorieTarget(input), CalculatorInputError);
    }

    assert.throws(
        () => calculateMacros({ weight: 75, calories: 1000, goal: 'bulk' }),
        CalculatorInputError,
    );
    assert.throws(
        () => calculateMacros({ weight: 75, calories: Number.NaN, goal: 'maintain' }),
        CalculatorInputError,
    );
});
