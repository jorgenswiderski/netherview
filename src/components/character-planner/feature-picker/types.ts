import { ICharacterFeatureCustomizationOption } from 'planner-types/src/types/character-feature-customization-option';
import { CharacterClassProgression } from '../../../api/weave/types';

export interface CharacterRaceOption
    extends ICharacterFeatureCustomizationOption {}
export interface CharacterClassOption
    extends ICharacterFeatureCustomizationOption {
    progression: CharacterClassProgression;
}
export interface CharacterBackgroundOption
    extends ICharacterFeatureCustomizationOption {}
