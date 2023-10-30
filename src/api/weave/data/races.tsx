import { RecordCompressor } from '@jorgenswiderski/tomekeeper-shared/dist/models/compressable-record/compressable-record';
import { CharacterRaceOption } from '../../../models/character/types';
import { WeaveRouteBase } from '../weave-route-base';

export class WeaveRaces extends WeaveRouteBase {
    constructor() {
        super('/data/races');
    }

    getRacesInfo = async (): Promise<CharacterRaceOption[]> => {
        const data = await this.fetchFromApi('/info');

        return RecordCompressor.parseAllValues(data);
    };
}
