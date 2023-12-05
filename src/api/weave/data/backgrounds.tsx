import { CharacterBackgroundOption } from '../../../models/character/types';
import { WeaveDataRoute } from './data';

export class WeaveBackgrounds extends WeaveDataRoute {
    constructor() {
        super('/backgrounds');
    }

    getBackgroundsInfo = async (): Promise<CharacterBackgroundOption[]> => {
        return this.fetchFromApi('/');
    };

    getBackgroundById = async (
        id: number,
    ): Promise<CharacterBackgroundOption> => {
        const background: CharacterBackgroundOption = await this.fetchFromApi(
            `/${id}`,
        );

        return background;
    };
}
