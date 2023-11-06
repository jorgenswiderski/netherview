import { ISpell } from '@jorgenswiderski/tomekeeper-shared/dist/types/action';
import { WeaveRouteBase } from '../weave-route-base';

export class WeaveSpells extends WeaveRouteBase {
    constructor() {
        super('/data/spells');
    }

    get = async (): Promise<ISpell[]> => {
        const actions = await this.memoize(async () => this.fetchFromApi('/'));

        return actions as ISpell[];
    };

    getById = async (id: number): Promise<ISpell> => {
        await this.get();

        const spell = (await this.cacheMap)?.get(id);

        if (!spell) {
            throw new Error(`Could not find spell with id=${id}`);
        }

        return spell as ISpell;
    };
}
