import { CONFIG } from '../../models/config';
import { BackgroundsInfo, RacesInfo } from './types';

async function fetchFromApi(endpoint: string) {
    const response = await fetch(`${CONFIG.WEAVE.API_URL}${endpoint}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch from API. Status: ${response.status}`);
    }

    return response.json();
}

export class WeaveApi {
    static getClassesInfo = async () => {
        return fetchFromApi('/classes/info');
    };

    static getClassProgression = async (classNames: string[]) => {
        return fetchFromApi(`/classes/progression/${classNames.join(',')}`);
    };

    static getRacesInfo = async (): Promise<RacesInfo> => {
        return fetchFromApi('/races/info');
    };

    static getBackgroundsInfo = async (): Promise<BackgroundsInfo> => {
        return fetchFromApi('/backgrounds/info');
    };
}
