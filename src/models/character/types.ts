import { ICharacterFeatureCustomizationOption } from 'planner-types/src/types/character-feature-customization-option';
import { CharacterClassProgression } from '../../api/weave/types';

export interface AbilityScores {
    Strength: number;
    Dexterity: number;
    Constitution: number;
    Intelligence: number;
    Wisdom: number;
    Charisma: number;
}

export interface CharacterRaceOption
    extends ICharacterFeatureCustomizationOption {}

export interface CharacterClassOption
    extends ICharacterFeatureCustomizationOption {
    progression: CharacterClassProgression;
}

export interface CharacterBackgroundOption
    extends ICharacterFeatureCustomizationOption {}

export interface ICharacter {
    clone(): ICharacter;
}
