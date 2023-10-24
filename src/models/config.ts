export const CONFIG = {
    IS_DEV: process.env.NEXT_PUBLIC_ENVIRONMENT === 'dev',
    EXPORT_ENABLED: process.env.NEXT_PUBLIC_EXPORT_ENABLED === 'true',
    WEAVE: {
        API_URL: process.env.NEXT_PUBLIC_WEAVE_API_URL,
        BASE_IMAGE_URL: process.env.NEXT_PUBLIC_WEAVE_BASE_IMAGE_URL,
    },
};
