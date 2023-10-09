import {
    CharacterClassOption,
    CharacterRaceOption,
} from '../../components/character-planner/choice-picker/types';
import { CONFIG } from '../../models/config';
import { BackgroundsInfo } from './types';

async function fetchFromApi(endpoint: string) {
    const response = await fetch(`${CONFIG.WEAVE.API_URL}${endpoint}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch from API. Status: ${response.status}`);
    }

    return response.json();
}

export class WeaveApi {
    static getClassesInfo = async (): Promise<CharacterClassOption[][]> => {
        return [await fetchFromApi('/classes/info')];
    };

    static getClassProgression = async (classNames: string[]) => {
        return fetchFromApi(`/classes/progression/${classNames.join(',')}`);
    };

    static getRacesInfo = async (): Promise<CharacterRaceOption[][]> => {
        return [await fetchFromApi('/races/info')];
    };

    static getBackgroundsInfo = async (): Promise<BackgroundsInfo> => {
        return fetchFromApi('/backgrounds/info');
    };
}
