import Hotjar from '@hotjar/browser';
import { CONFIG } from './config';

declare global {
    interface Window {
        hj: (command: string, ...args: any[]) => void;
        hjOptOut: boolean;
    }
}

export class HotjarService {
    static initialized = false;
    static enabled = false;

    private static init(): void {
        const siteId = CONFIG.HOTJAR.SITE_ID;
        const hotjarVersion = CONFIG.HOTJAR.VERSION;

        if (!siteId || !hotjarVersion) {
            if (CONFIG.IS_DEV) {
                return;
            }

            throw new Error('Failed to intialize hotjar');
        }

        Hotjar.init(siteId, hotjarVersion);
        this.initialized = true;
    }

    static enable() {
        if (!this.initialized) {
            this.init();
        } else {
            window.hj('tagRecording', ['do-not-track']);
            window.hjOptOut = true;
        }

        this.enabled = true;
    }

    static disable() {
        if (this.initialized) {
            window.hj('unTagRecording', ['do-not-track']);
            window.hjOptOut = false;
        }

        this.enabled = false;
    }
}
