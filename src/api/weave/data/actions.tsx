// actions.tsx
import { IAction } from '@jorgenswiderski/tomekeeper-shared/dist/types/action';
import { WeaveDataRoute } from './data';

export class WeaveActions extends WeaveDataRoute {
    constructor() {
        super('/actions');
    }

    get = async (): Promise<IAction[]> => {
        const actions = await this.memoize(async () => this.fetchFromApi('/'));

        return actions as IAction[];
    };

    getById = async (id: number): Promise<IAction> => {
        await this.get();

        return (await this.cacheMap)?.get(id)! as IAction;
    };
}
