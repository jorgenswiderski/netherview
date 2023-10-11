import { ICharacterFeatureCustomizationOption } from 'planner-types/src/types/character-feature-customization-option';

export interface CharacterClassProgressionLevel {
    Level: number;
    'Proficiency Bonus': number;
    Features: ICharacterFeatureCustomizationOption[];
    'Cantrips Known'?: number;
    'Spell Slots'?: (null | number)[];
}

export type CharacterClassProgression = CharacterClassProgressionLevel[];
