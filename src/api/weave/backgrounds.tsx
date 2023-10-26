import { CharacterBackgroundOption } from '../../models/character/types';
import { WeaveRouteBase } from './weave-route-base';

export class WeaveBackgrounds extends WeaveRouteBase {
    constructor() {
        super('/backgrounds');
    }

    getBackgroundsInfo = async (): Promise<CharacterBackgroundOption[]> => {
        return this.fetchFromApi('/info');
    };

    getBackgroundById = async (
        id: number,
    ): Promise<CharacterBackgroundOption> => {
        const keyed: Record<string, CharacterBackgroundOption> =
            await this.fetchFromApi(`/info/id?ids=${id}`);

        return Object.values(keyed)[0];
    };
}
