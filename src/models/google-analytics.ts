import ReactGA from 'react-ga';
import { CONFIG } from './config';

declare global {
    interface Window {
        [key: string]: any;
    }
}

export class GoogleAnalytics {
    static enabled = false;
    static initialized = false;

    static init(): void {
        if (!CONFIG.GOOGLE_ANALYTICS.ID) {
            return;
        }

        ReactGA.initialize(CONFIG.GOOGLE_ANALYTICS.ID);
        this.initialized = true;
    }

    static logPageView(): void {
        if (!this.enabled) {
            return;
        }

        const page = window.location.pathname;
        ReactGA.set({ page });
        ReactGA.pageview(page);
    }

    static enable() {
        if (!this.initialized) {
            this.init();
        }

        this.enabled = true;
        window[`ga-disable-${CONFIG.GOOGLE_ANALYTICS.ID}`] = !this.enabled;
    }

    static disable() {
        this.enabled = false;
        window[`ga-disable-${CONFIG.GOOGLE_ANALYTICS.ID}`] = !this.enabled;
    }
}
