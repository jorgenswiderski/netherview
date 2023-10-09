import { CharacterEvents } from '../../../models/character/types';

export interface ICharacterFeatureCustomizationOption {
    name: string;
    description?: string;
    choices?: ICharacterFeatureCustomizationOption[][];
    image?: string;
    choiceType?: CharacterEvents;
}
