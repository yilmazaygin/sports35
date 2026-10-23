import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            colors: {
                brand: {
                    black: '#0B0B0B',
                    surface: '#151515',
                    elevated: '#1C1C1C',
                    border: '#292929',
                    orange: '#F25A0A',
                    'orange-dark': '#D94800',
                    // Compatibility aliases keep existing component behavior while
                    // moving the rendered brand accent away from the legacy red.
                    red: '#F25A0A',
                    'red-dark': '#D94800',
                },
            },
            fontFamily: {
                sans: ['Inter', 'Figtree', ...defaultTheme.fontFamily.sans],
            },
        },
    },

    plugins: [forms, typography],
};
