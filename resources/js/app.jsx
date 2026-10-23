import '../css/app.css';
import './bootstrap';
import faviconUrl from '@/../images/brand/sports35-mark.png';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot, hydrateRoot } from 'react-dom/client';

const documentBrand = 'Sports35';

const favicon = document.querySelector('link[rel="icon"]') ?? document.createElement('link');
favicon.rel = 'icon';
favicon.type = 'image/png';
favicon.href = faviconUrl;
document.head.appendChild(favicon);

createInertiaApp({
    title: (title) => (title === documentBrand ? title : `${title} - ${documentBrand}`),
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const app = <App {...props} />;

        if (el.hasAttribute('data-snapshot')) {
            el.replaceChildren();
            createRoot(el).render(app);

            return;
        }

        if (el.hasChildNodes()) {
            hydrateRoot(el, app);

            return;
        }

        createRoot(el).render(app);
    },
    progress: {
        color: '#F25A0A',
    },
});
