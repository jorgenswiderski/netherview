import { ISpell } from '@jorgenswiderski/tomekeeper-shared/dist/types/action';
import { WeaveDataRoute } from './data';

type ItemWithId = { id: number };

export class WeaveSpells extends WeaveDataRoute {
    constructor() {
        super('/spells');
    }

    protected async memoize(
        fetchFunction: () => Promise<ItemWithId[]>,
    ): Promise<ISpell[]> {
        const initialized = !!this.cache;
        const actions = (await super.memoize(fetchFunction)) as ISpell[];

        if (!initialized) {
            // Add spell variants to the cache map
            await Promise.all(
                actions
                    .filter(
                        (action) =>
                            action.variants && action.variants.length > 0,
                    )
                    .flatMap((action) =>
                        action.variants!.map(async (variant) => {
                            (await this.cacheMap)!.set(variant.id, variant);
                        }),
                    ),
            );
        }

        return actions;
    }

    get = async (): Promise<ISpell[]> => {
        const actions = await this.memoize(async () => this.fetchFromApi('/'));

        return actions;
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
