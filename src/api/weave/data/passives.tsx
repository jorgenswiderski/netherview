// passives.tsx
import { ICharacteristic } from '@jorgenswiderski/tomekeeper-shared/dist/types/grantable-effect';
import { WeaveRouteBase } from '../weave-route-base';

export class WeavePassives extends WeaveRouteBase {
    constructor() {
        super('/data/passives');
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
