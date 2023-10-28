import { ISpell } from 'planner-types/src/types/action';
import { WeaveRouteBase } from './weave-route-base';

export class WeaveSpells extends WeaveRouteBase {
    constructor() {
        super('/spells');
    }

    get = async (): Promise<ISpell[]> => {
        const actions = await this.memoize(() =>
            this.fetchFromApi('/?filter=class'),
        );

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
