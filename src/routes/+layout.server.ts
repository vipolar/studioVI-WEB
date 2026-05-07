import type { LayoutServerLoad } from './$types';

const routeColorMap = {
    "/workspaces/runpod": {
        "--theme-color": '#22c1c3',
        "--auxilary-color": '#fdbb2d'
    },
    "/workspaces/tensordock": {
        "--theme-color": '#22c1c3',
        "--auxilary-color": '#fdbb2d'
    },
    "/workspaces/massedcompute": {
        "--theme-color": '#cf2e2e',
        "--auxilary-color": '#334862'
    }
};

export const load: LayoutServerLoad = async ({ url }) => {
    for (const [pathName, pathTheme] of Object.entries(routeColorMap)) {
        if (url.pathname.startsWith(pathName)) {
            return {
                theme: pathTheme
            };
        }
    }
};