// passives.tsx
import { ICharacteristic } from '@jorgenswiderski/tomekeeper-shared/dist/types/grantable-effect';
import { WeaveDataRoute } from './data';

export class WeavePassives extends WeaveDataRoute {
    constructor() {
        super('/passives');
    }

    get = async (): Promise<ICharacteristic[]> => {
        const actions = await this.memoize(async () => this.fetchFromApi('/'));

        return actions as ICharacteristic[];
    };

    getById = async (id: number): Promise<ICharacteristic> => {
        await this.get();

        return (await this.cacheMap)?.get(id)! as ICharacteristic;
    };
}
