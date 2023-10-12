import { ICharacterFeatureCustomizationOption } from 'planner-types/src/types/character-feature-customization-option';
import { GrantableEffect } from 'planner-types/src/types/grantable-effect';
import { CharacterClassOption } from '../../components/character-planner/feature-picker/types';

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

export interface ICharacter {
    augmentClassOptions(
        classes: CharacterClassOption[],
    ): CharacterClassOption[];
}
