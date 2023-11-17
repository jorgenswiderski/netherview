import ReactGA from 'react-ga';
import { CONFIG } from './config';
import { error } from './logger';

declare global {
    interface Window {
        [key: string]: any;
    }
}

export class GoogleAnalytics {
    static enabled = false;
    static initialized = false;

    static init(): boolean {
        if (!CONFIG.GOOGLE_ANALYTICS.ID) {
            error('Could not find analytics ID');

            return false;
        }

        ReactGA.initialize(CONFIG.GOOGLE_ANALYTICS.ID);
        this.initialized = true;
        // log('Initialized google analytics');

        return true;
    }

    static logPageView(): void {
        if (!this.enabled) {
            return;
        }

        const page = window.location.pathname;
        ReactGA.set({ page });
        ReactGA.pageview(page);
        // log('Logged page view', page);
    }

    static enable(): void {
        if (!this.initialized) {
            if (!this.init()) {
                return;
            }
        }

        this.enabled = true;
        window[`ga-disable-${CONFIG.GOOGLE_ANALYTICS.ID}`] = !this.enabled;
        // log('Enabled google analytics');
    }

    static disable(): void {
        this.enabled = false;
        window[`ga-disable-${CONFIG.GOOGLE_ANALYTICS.ID}`] = !this.enabled;
        // log('Disabled google analytics');
    }
}
