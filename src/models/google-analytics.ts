import ReactGA from 'react-ga';
import { CONFIG } from './config';

let initialized = false;

export const initGA = (): void => {
    if (!CONFIG.GOOGLE_ANALYTICS.ID) {
        return;
    }

    ReactGA.initialize(CONFIG.GOOGLE_ANALYTICS.ID);
    initialized = true;
};

export const logPageView = (): void => {
    if (!initialized) {
        return;
    }

    const page = window.location.pathname;
    ReactGA.set({ page });
    ReactGA.pageview(page);
};
