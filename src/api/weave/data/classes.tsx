import { StaticReference } from '@jorgenswiderski/tomekeeper-shared/dist/models/static-reference/static-reference';
import { WeaveRouteBase } from '../weave-route-base';
import { CharacterClassOption } from '../../../models/character/types';

export class WeaveClasses extends WeaveRouteBase {
    constructor() {
        super('/data/classes');
    }

    getClassesInfo = async (): Promise<CharacterClassOption[]> => {
        const data = await this.fetchFromApi('/');
        const parsed = await StaticReference.parseAllValues(data);

        return parsed;
    };
}
