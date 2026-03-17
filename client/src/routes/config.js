import { Layout, Briefcase, Target, Zap, ListChecks, Rocket } from 'lucide-react';

export const ROUTES = {
    // Public Routes
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    FAQ: '/faq',
    TERMS: '/terms',
    PRIVACY: '/privacy',

    // Protected App Routes
    APP_ROOT: '/app',
    DASHBOARD: '/app/dashboard',
    PROJECTS: '/app/projects',
    PROJECT_DETAIL: '/app/projects/:projectId',
    WORKFLOWS: '/app/workflow',
    ANALYTICS: '/app/analytics',
    MY_WORK: '/app/my-work',
    ORGANIZATION: '/app/organization',
    RELEASES: '/app/releases',
};

export const NAV_ITEMS = [
    { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: Layout },
    { label: 'Projects', path: ROUTES.PROJECTS, icon: Briefcase },
    { label: 'Workflows', path: ROUTES.WORKFLOWS, icon: Target },
    { label: 'Releases', path: ROUTES.RELEASES, icon: Rocket },
    { label: 'Analytics', path: ROUTES.ANALYTICS, icon: Zap },
];
