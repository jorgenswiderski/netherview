// passives.tsx
import { IPassive } from '@jorgenswiderski/tomekeeper-shared/dist/types/grantable-effect';
import { WeaveDataRoute } from './data';

export class WeavePassives extends WeaveDataRoute {
    constructor() {
        super('/passives');
    }

    get = async (): Promise<IPassive[]> => {
        const actions = await this.memoize(async () => this.fetchFromApi('/'));

        return actions as IPassive[];
    };

    getById = async (id: number): Promise<IPassive> => {
        await this.get();

        return (await this.cacheMap)?.get(id)! as IPassive;
    };
}
