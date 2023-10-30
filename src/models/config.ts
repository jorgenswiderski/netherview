import { CONFIG as SharedConfig } from 'planner-types/src/models/config';

export const CONFIG = {
    ...SharedConfig,

    APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    EXPORT_ENABLED: process.env.NEXT_PUBLIC_EXPORT_ENABLED === 'true',
    WEAVE: {
        API_URL: process.env.NEXT_PUBLIC_WEAVE_API_URL,
        BASE_IMAGE_URL: process.env.NEXT_PUBLIC_WEAVE_BASE_IMAGE_URL,
    },
    GOOGLE_ANALYTICS: {
        ID: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
    },
    HOTJAR: {
        SITE_ID: process.env.NEXT_PUBLIC_HOTJAR_SITE_ID
            ? parseInt(process.env.NEXT_PUBLIC_HOTJAR_SITE_ID, 10)
            : undefined,
        VERSION: process.env.NEXT_PUBLIC_HOTJAR_VERSION
            ? parseInt(process.env.NEXT_PUBLIC_HOTJAR_VERSION, 10)
            : undefined,
    },
};
