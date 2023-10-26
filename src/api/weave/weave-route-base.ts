// weave-route-base.ts
import axios from 'axios';
import { CONFIG } from '../../models/config';

type ItemWithId = { id: number };

export class WeaveRouteBase {
    constructor(protected baseRoute: string) {}

    async fetchFromApi(endpoint: string) {
        try {
            const response = await axios.get(
                `${CONFIG.WEAVE.API_URL}${this.baseRoute}${endpoint}`,
            );

            return response.data;
        } catch (error) {
            // Check if the error is an Axios error
            if (axios.isAxiosError(error) && error.response) {
                throw new Error(
                    `Failed to fetch from API. Status: ${error.response.status}`,
                );
            }

            // If the error is not an Axios error or any other unknown error
            throw error;
        }
    }

    protected cacheMap?: Promise<Map<number, ItemWithId>>;
    protected cache?: Promise<ItemWithId[]>;

    protected async memoize(
        fetchFunction: () => Promise<ItemWithId[]>,
    ): Promise<ItemWithId[]> {
        if (!this.cache) {
            this.cache = fetchFunction();

            this.cacheMap = new Promise((resolve) => {
                const map = new Map<number, ItemWithId>();

                this.cache!.then((data) => {
                    data.forEach((item) => map.set(item.id, item));
                    resolve(map);
                });
            });
        }

        return this.cache;
    }
}
