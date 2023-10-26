import { StaticReference } from 'planner-types/src/models/static-reference/static-reference';
import { CharacterRaceOption } from '../../models/character/types';
import { WeaveRouteBase } from './weave-route-base';

export class WeaveRaces extends WeaveRouteBase {
    constructor() {
        super('/races');
    }

    getRacesInfo = async (): Promise<CharacterRaceOption[]> => {
        const data = await this.fetchFromApi('/info');

        return StaticReference.parseAllValues(data);
    };
}
