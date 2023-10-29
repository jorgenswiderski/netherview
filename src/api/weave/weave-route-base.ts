// weave-route-base.ts
import axios, { AxiosRequestConfig } from 'axios';
import { CONFIG } from '../../models/config';

type ItemWithId = { id: number };

export class WeaveRouteBase {
    constructor(protected baseRoute: string) {}

    async fetchFromApi(
        endpoint: string,
        config: AxiosRequestConfig = { method: 'GET' },
    ) {
        try {
            const response = await axios({
                url: `${CONFIG.WEAVE.API_URL}${this.baseRoute}${endpoint}`,
                ...config,
            });

            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    throw new Error(
                        `Failed to fetch from API. Status: ${
                            error.response.status
                        }, Data: ${JSON.stringify(error.response.data)}`,
                    );
                } else if (error.request) {
                    // The request was made but no response was received
                    throw new Error(
                        'The request was made but no response was received',
                    );
                } else {
                    // Something happened in setting up the request that triggered an Error
                    throw new Error(
                        `Error in setting up the request: ${error.message}`,
                    );
                }
            } else {
                // If the error is not an Axios error or any other unknown error
                throw new Error(
                    `Unknown error: ${
                        error instanceof Error ? error.message : error
                    }`,
                );
            }
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
