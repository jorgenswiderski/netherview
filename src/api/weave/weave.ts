import axios from 'axios';
import { ISpell } from 'planner-types/src/types/spell';
import {
    EquipmentSlot,
    IEquipmentItem,
    equipmentSlotTypes,
} from 'planner-types/src/types/equipment-item';
import { CONFIG } from '../../models/config';
import {
    CharacterClassOption,
    CharacterRaceOption,
    CharacterBackgroundOption,
} from '../../models/character/types';

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

    static getBackgroundById = async (
        id: number,
    ): Promise<CharacterBackgroundOption> => {
        const keyed: Record<string, CharacterBackgroundOption> =
            await fetchFromApi(`/backgrounds/info/id?ids=${id}`);

        return Object.values(keyed)[0];
    };

    static getClassSpellInfo = async (): Promise<ISpell[]> => {
        return fetchFromApi('/spells/info?filter=class');
    };

    static getSpellById = async (id: number): Promise<ISpell> => {
        const keyed: Record<string, ISpell> = await fetchFromApi(
            `/spells/info/id?ids=${id}`,
        );

        return Object.values(keyed)[0];
    };

    static getEquipmentItemInfo = async (
        slot: EquipmentSlot,
    ): Promise<IEquipmentItem[]> => {
        const types = equipmentSlotTypes[slot];

        const keyed: Record<string, IEquipmentItem[]> = await fetchFromApi(
            `/items/equipment/type?types=${types.join(',')}`,
        );

        return Object.values(keyed).flat();
    };

    static getEquipmentItemInfoById = async (
        id: number,
    ): Promise<IEquipmentItem> => {
        const keyed: Record<string, IEquipmentItem> = await fetchFromApi(
            `/items/equipment/id?ids=${id}`,
        );

        return Object.values(keyed)[0];
    };

    static getImagePath = (imageName: string): string =>
        `${CONFIG.WEAVE.BASE_IMAGE_URL}/${imageName}`;
}
