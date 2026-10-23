import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { renderToString } from 'react-dom/server';
import { route as ziggyRoute } from './ziggy-route.js';

const documentBrand = 'Sports35';

function installRoute(page) {
    const ziggy = page?.props?.ziggy;

    globalThis.route = (name, params, absolute) => ziggyRoute(name, params, absolute, ziggy ? {
        ...ziggy,
        location: new URL(ziggy.location),
    } : undefined);
}

createServer((page) => createInertiaApp({
    page,
    render: renderToString,
    title: (title) => (title === documentBrand ? title : `${title} - ${documentBrand}`),
    resolve: (name) => resolvePageComponent(
        `./Pages/${name}.jsx`,
        import.meta.glob('./Pages/**/*.jsx'),
    ),
    setup: ({ App, props }) => {
        installRoute(page);

        return <App {...props} />;
    },
}));
