import { ICharacterOption } from 'planner-types/src/types/character-feature-customization-option';

export interface CharacterClassProgressionLevel {
    Level: number;
    'Proficiency Bonus': number;
    Features: ICharacterOption[];
    'Cantrips Known'?: number;
    'Spell Slots'?: (null | number)[];
}

export type CharacterClassProgression = CharacterClassProgressionLevel[];
