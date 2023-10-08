import { ICharacterFeatureCustomizationOption } from '../../components/character-planner/choice-picker/types';

export interface RaceInfo {
    name: string;
    description: string;
    choices?: ICharacterFeatureCustomizationOption[];
    image: string;
}

export type RacesInfo = { [key: string]: RaceInfo };
