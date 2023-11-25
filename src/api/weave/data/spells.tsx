import { ISpell } from '@jorgenswiderski/tomekeeper-shared/dist/types/action';
import { WeaveDataRoute } from './data';

export class WeaveSpells extends WeaveDataRoute {
    constructor() {
        super('/spells');
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
