import { StaticReference } from '@jorgenswiderski/tomekeeper-shared/dist/models/static-reference/static-reference';
import { CharacterRaceOption } from '../../../models/character/types';
import { WeaveRouteBase } from '../weave-route-base';

export class WeaveRaces extends WeaveRouteBase {
    constructor() {
        super('/data/races');
    }

    getRacesInfo = async (): Promise<CharacterRaceOption[]> => {
        const data = await this.fetchFromApi('/info');
        const parsed = await StaticReference.parseAllValues(data);

        return parsed;
    };
}
