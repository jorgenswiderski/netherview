import Hotjar from '@hotjar/browser';
import { CONFIG } from './config';

export function initHotjar(): void {
    const siteId = CONFIG.HOTJAR.SITE_ID;
    const hotjarVersion = CONFIG.HOTJAR.VERSION;

    if (!siteId || !hotjarVersion) {
        throw new Error('Failed to intialize hotjar');
    }

    Hotjar.init(siteId, hotjarVersion);
}
