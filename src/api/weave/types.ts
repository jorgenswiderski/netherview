import { ICharacterOption } from '@jorgenswiderski/tomekeeper-shared/dist/types/character-feature-customization-option';

export interface CharacterClassProgressionLevel {
    Level: number;
    'Proficiency Bonus': number;
    Features: ICharacterOption[];
    'Spells Known'?: number;
    'Cantrips Known'?: number;
    'Spell Slots'?: (null | number)[] | number;
    'Slot Level'?: number; // Warlock
}

export type CharacterClassProgression = CharacterClassProgressionLevel[];
