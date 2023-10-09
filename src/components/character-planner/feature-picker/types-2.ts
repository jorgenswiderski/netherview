import { CharacterClassProgression } from '../../../api/weave/types';
import { ICharacterFeatureCustomizationOption } from './types';

export interface CharacterRaceOption
    extends ICharacterFeatureCustomizationOption {}
export interface CharacterClassOption
    extends ICharacterFeatureCustomizationOption {
    progression: CharacterClassProgression;
}
export interface CharacterBackgroundOption
    extends ICharacterFeatureCustomizationOption {}
