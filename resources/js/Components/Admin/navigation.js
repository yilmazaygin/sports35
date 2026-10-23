const adminGroupDefinitions = [
    {
        key: 'overview',
        items: [
            { key: 'dashboard', route: 'dashboard', icon: 'home' },
        ],
    },
    {
        key: 'gym',
        items: [
            { key: 'working_hours', route: 'working-hours.edit', icon: 'clock' },
            { key: 'membership_packages', route: 'membership-packages.index', icon: 'tag' },
            { key: 'campaigns', route: 'campaigns.index', icon: 'megaphone' },
            { key: 'special_days', route: 'special-days.index', icon: 'calendar' },
        ],
    },
    {
        key: 'content',
        items: [
            { key: 'blog_posts', route: 'blog-posts.index', icon: 'document' },
            { key: 'gallery', route: 'gallery.index', icon: 'photo' },
            { key: 'facilities', route: 'facilities.index', icon: 'building' },
            { key: 'media', route: 'media.index', icon: 'folder' },
        ],
    },
    {
        key: 'site',
        items: [
            { key: 'settings', route: 'site-settings.edit', icon: 'spark' },
        ],
    },
];

const systemGroup = {
    key: 'system',
    items: [
        { key: 'audit_logs', route: 'audit-logs.index', icon: 'shield' },
    ],
};

export function adminGroups() {
    return [...adminGroupDefinitions, systemGroup];
}

export function isAdminNavActive(routeName) {
    if (routeName === 'dashboard') {
        return route().current('dashboard');
    }

    const prefix = routeName.split('.')[0];

    return Boolean(route().current(`${prefix}.*`) || route().current(routeName));
}
