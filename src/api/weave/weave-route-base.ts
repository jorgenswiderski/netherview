// weave-route-base.ts
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import axiosRetry from 'axios-retry';
import { CONFIG } from '../../models/config';
import { log } from '../../models/logger';

type ItemWithId = { id: number };

axiosRetry(axios, {
    retries: 3,
    retryDelay: axiosRetry.exponentialDelay,
});

export class WeaveBaseRoute {
    axios: AxiosInstance;

    constructor(protected baseRoute: string) {
        log(`${CONFIG.WEAVE.API_URL}${this.baseRoute}`);

        this.axios = axios.create({
            baseURL: `${CONFIG.WEAVE.API_URL}${this.baseRoute}`,
        });
    }

    async fetchFromApi(
        endpoint: string,
        config: AxiosRequestConfig = { method: 'GET' },
    ) {
        try {
            log(endpoint);

            const response = await this.axios({
                url: endpoint,
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

            // Assign both promises before awaiting
            let mapResolver;

            this.cacheMap = new Promise((resolve) => {
                mapResolver = resolve;
            });

            const map = new Map<number, ItemWithId>();
            // Need to await the function here, because the alternative is
            // promise chaining inside the map promise executor, which would
            // either mean unhandled rejection or not propagating
            // the error to the caller
            (await this.cache).forEach((item) => map.set(item.id, item));
            mapResolver!(map);
        }

        return this.cache;
    }
}
