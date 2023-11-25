// data.tsx
import { WeaveBaseRoute } from '../weave-route-base';
import { ResponseInterceptors } from '../interceptors/response-interceptors';

export class WeaveDataRoute extends WeaveBaseRoute {
    constructor(subRoute: string) {
        super(`/data${subRoute}`);

        this.axios.interceptors.response.use(...ResponseInterceptors.Intern);
    }
}
