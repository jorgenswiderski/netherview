// actions.tsx
import { IAction } from '@jorgenswiderski/tomekeeper-shared/dist/types/action';
import { WeaveRouteBase } from '../weave-route-base';

export class WeaveActions extends WeaveRouteBase {
    constructor() {
        super('/data/actions');
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
