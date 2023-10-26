import { ISpell } from 'planner-types/src/types/action';
import { WeaveRouteBase } from './weave-route-base';

export class WeaveSpells extends WeaveRouteBase {
    constructor() {
        super('/spells');
    }

    get = async (): Promise<ISpell[]> => {
        const actions = await this.memoize(() => this.fetchFromApi('/info'));

        return actions as ISpell[];
    };

    getById = async (id: number): Promise<ISpell> => {
        await this.get();

        return (await this.cacheMap)?.get(id)! as ISpell;
    };
}
