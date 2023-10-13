import {
    CharacterPlannerStep,
    ICharacterFeatureCustomizationOption,
} from 'planner-types/src/types/character-feature-customization-option';
import { ICharacterDecision } from './character-states';
import { ICharacterFeatureCustomizationOptionWithSource } from './types';

export class CharacterDecision implements ICharacterDecision {
    type: CharacterPlannerStep;
    choices?: ICharacterFeatureCustomizationOptionWithSource[][];

    constructor(source: ICharacterFeatureCustomizationOption) {
        if (!source.choices || source.choices.length === 0) {
            throw new Error(
                `The choices array is missing or empty in the character decision '${source.name}'.`,
            );
        }

        if (!source.choiceType) {
            throw new Error(
                `The choice type is missing in the character decision '${source.name}'.`,
            );
        }

        this.type = source.choiceType;

        this.choices = source.choices.map((choiceA) =>
            choiceA.map((choiceB) => ({
                ...choiceB,
                source:
                    (choiceB as ICharacterFeatureCustomizationOptionWithSource)
                        ?.source ?? source,
            })),
        );
    }
}
