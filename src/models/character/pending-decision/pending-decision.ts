import {
    CharacterPlannerStep,
    ICharacterFeatureCustomizationOption,
} from 'planner-types/src/types/character-feature-customization-option';
import {
    CharacterDecisionInfo,
    DecisionStateInfo,
    IPendingDecision,
} from '../character-states';
import {
    CharacterTreeDecision,
    CharacterTreeRoot,
} from '../character-tree-node/character-tree';
import { ICharacter } from '../types';
import { Utils } from '../../utils';

export class PendingDecision implements IPendingDecision {
    public info?: DecisionStateInfo;

    constructor(
        public type: CharacterPlannerStep,
        public parent: CharacterTreeDecision | CharacterTreeRoot | null,
        public choices?: ICharacterFeatureCustomizationOption[][],
    ) {
        this.info = CharacterDecisionInfo[type];

        if (choices?.length === 0) {
            throw new Error(
                `The choices array is missing or empty in the character decision '${
                    parent?.name ?? 'null'
                }'.`,
            );
        }
    }

    preloadChoices(): void {
        if (this.choices) {
            this.choices.forEach((choice) => Utils.preloadChoiceImages(choice));
        }
    }

    async loadChoices(character: ICharacter): Promise<ICharacter | null> {
        let newCharacter: ICharacter | null = null;

        if (!this.choices && this.info) {
            const gc = this.info.getChoices as (
                character: ICharacter,
            ) => Promise<ICharacterFeatureCustomizationOption[][]>;

            this.choices = (await gc(character)) ?? undefined;
            newCharacter = character.clone();
        }

        this.preloadChoices();

        return newCharacter;
    }
}
