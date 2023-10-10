import axios from 'axios';
import {
    CharacterClassOption,
    CharacterRaceOption,
    CharacterBackgroundOption,
} from '../../components/character-planner/feature-picker/types-2';
import { CONFIG } from '../../models/config';

async function fetchFromApi(endpoint: string) {
    try {
        const response = await axios.get(`${CONFIG.WEAVE.API_URL}${endpoint}`);

        return response.data;
    } catch (error) {
        // Check if the error is an Axios error
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(
                `Failed to fetch from API. Status: ${error.response.status}`,
            );
        }

        // If the error is not an Axios error or any other unknown error
        throw error;
    }
}

export class WeaveApi {
    static getClassesInfo = async (): Promise<CharacterClassOption[]> => {
        return fetchFromApi('/classes/info');
    };

    static getRacesInfo = async (): Promise<CharacterRaceOption[]> => {
        return fetchFromApi('/races/info');
    };

    static getBackgroundsInfo = async (): Promise<
        CharacterBackgroundOption[]
    > => {
        return fetchFromApi('/backgrounds/info');
    };
}
