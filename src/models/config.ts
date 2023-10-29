import { CONFIG as SharedConfig } from 'planner-types/src/models/config';

export const CONFIG = {
    ...SharedConfig,

    BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    EXPORT_ENABLED: process.env.NEXT_PUBLIC_EXPORT_ENABLED === 'true',
    WEAVE: {
        API_URL: process.env.NEXT_PUBLIC_WEAVE_API_URL,
        BASE_IMAGE_URL: process.env.NEXT_PUBLIC_WEAVE_BASE_IMAGE_URL,
    },
};
