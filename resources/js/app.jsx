import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        try {
            const profile = props?.initialPage?.props?.profile;
            if (profile && typeof profile.avatar === 'string') {
                const ts = profile.updated_at ? new Date(profile.updated_at).getTime() : Date.now();
                const href = (profile.avatar.startsWith('http') ? profile.avatar : '/' + profile.avatar.replace(/\.(png|jpg|jpeg)$/i, '.webp')) + '?v=' + ts;
                const link = document.querySelector('link[rel="icon"]') || document.createElement('link');
                link.rel = 'icon';
                link.href = href;
                if (!link.parentNode) document.head.appendChild(link);
            }
        } catch (e) {
            console.error('Error setting favicon:', e);
        }

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
