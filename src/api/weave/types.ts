import { ICharacterFeatureCustomizationOption } from '../../components/character-planner/feature-picker/types';

export interface CharacterClassProgressionLevel {
    Level: number;
    'Proficiency Bonus': number;
    Features: ICharacterFeatureCustomizationOption[];
    'Cantrips Known'?: number;
    'Spell Slots'?: (null | number)[];
}

export type CharacterClassProgression = CharacterClassProgressionLevel[];
