import { CharacterClassOption } from '../../../models/character/types';
import { WeaveDataRoute } from './data';
import { ResponseInterceptors } from '../interceptors/response-interceptors';

export class WeaveClasses extends WeaveDataRoute {
    constructor() {
        super('/classes');

        this.axios.interceptors.response.use(
            ...ResponseInterceptors.StaticReference,
        );
    }

    getClassesInfo = async (): Promise<CharacterClassOption[]> => {
        const data = await this.fetchFromApi('/');

        return data;
    };
}
