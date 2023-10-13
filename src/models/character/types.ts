import { ICharacterFeatureCustomizationOption } from 'planner-types/src/types/character-feature-customization-option';
import { GrantableEffect } from 'planner-types/src/types/grantable-effect';
import { CharacterClassProgression } from '../../api/weave/types';

export interface AbilityScores {
    Strength: number;
    Dexterity: number;
    Constitution: number;
    Intelligence: number;
    Wisdom: number;
    Charisma: number;
}

export interface GrantableEffectWithSource extends GrantableEffect {
    source: ICharacterFeatureCustomizationOption;
}

export interface ICharacterFeatureCustomizationOptionWithSource
    extends ICharacterFeatureCustomizationOption {
    source: ICharacterFeatureCustomizationOption;
}

export interface CharacterRaceOption
    extends ICharacterFeatureCustomizationOption {}

export interface CharacterClassOption
    extends ICharacterFeatureCustomizationOption {
    progression: CharacterClassProgression;
}

export interface CharacterClassOptionWithSource
    extends ICharacterFeatureCustomizationOptionWithSource {
    progression: CharacterClassProgression;
}
export interface CharacterBackgroundOption
    extends ICharacterFeatureCustomizationOption {}

export interface ICharacter {
    augmentClassOptions(
        classes: CharacterClassOption[],
    ): CharacterClassOptionWithSource[];

    augmentCustomizationOptionWithRoot(
        choices: ICharacterFeatureCustomizationOption[][],
    ): ICharacterFeatureCustomizationOptionWithSource[][];
}
