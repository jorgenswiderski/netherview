import { ICharacterOption } from 'planner-types/src/types/character-feature-customization-option';
import { CharacterClassProgression } from '../../api/weave/types';

export interface AbilityScores {
    Strength: number;
    Dexterity: number;
    Constitution: number;
    Intelligence: number;
    Wisdom: number;
    Charisma: number;
}

export interface CharacterRaceOption extends ICharacterOption {}

export interface CharacterClassOption extends ICharacterOption {
    progression: CharacterClassProgression;
}

export interface CharacterBackgroundOption extends ICharacterOption {}

export interface ICharacter {
    clone(): ICharacter;
    classData: CharacterClassOption[];
    getTotalAbilityScores(): AbilityScores | null;
}
