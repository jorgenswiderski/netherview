import { RecordCompressor } from 'planner-types/src/models/compressable-record/compressable-record';
import { WeaveRouteBase } from './weave-route-base';
import { CharacterClassOption } from '../../models/character/types';

export class WeaveClasses extends WeaveRouteBase {
    constructor() {
        super('/classes');
    }

    getClassesInfo = async (): Promise<CharacterClassOption[]> => {
        const data = await this.fetchFromApi('/');

        return RecordCompressor.parseAllValues(data);
    };
}
