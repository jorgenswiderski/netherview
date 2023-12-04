import { CharacterRaceOption } from '../../../models/character/types';
import { WeaveDataRoute } from './data';
import { ResponseInterceptors } from '../interceptors/response-interceptors';

export class WeaveRaces extends WeaveDataRoute {
    constructor() {
        super('/races');

        this.axios.interceptors.response.use(
            ...ResponseInterceptors.StaticReference,
        );
    }

    getRacesInfo = async (): Promise<CharacterRaceOption[]> => {
        const data = await this.fetchFromApi('/');

        return data;
    };
}
