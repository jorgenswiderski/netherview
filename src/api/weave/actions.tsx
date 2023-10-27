// actions.tsx
import { IAction } from 'planner-types/src/types/action';
import { WeaveRouteBase } from './weave-route-base';

export class WeaveActions extends WeaveRouteBase {
    constructor() {
        super('/actions');
    }

    get = async (): Promise<IAction[]> => {
        const actions = await this.memoize(() => this.fetchFromApi('/'));

        return actions as IAction[];
    };

    getById = async (id: number): Promise<IAction> => {
        await this.get();

        return (await this.cacheMap)?.get(id)! as IAction;
    };
}
