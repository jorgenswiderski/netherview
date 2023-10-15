// character-states.ts
import React from 'react';
import {
    CharacterPlannerStep,
    ICharacterFeatureCustomizationOption,
} from 'planner-types/src/types/character-feature-customization-option';
import { WeaveApi } from '../../api/weave/weave';
import { ICharacter } from './types';
import {
    CharacterTreeDecision,
    CharacterTreeRoot,
} from './character-tree-node/character-tree';
import AbilitiesPointBuy from '../../components/character-planner/abilities/abilities-point-buy';
import AbilitiesIncrease from '../../components/character-planner/abilities/abilities-increase';

export interface CharacterWidgetProps {
    onDecision: (
        decision: IPendingDecision,
        value: ICharacterFeatureCustomizationOption,
    ) => void;
    decision: IPendingDecision;
    character: ICharacter;
}

export interface DecisionStateInfo {
    title: string;
    render?: (props: CharacterWidgetProps) => JSX.Element;
    event: CharacterPlannerStep;
    getChoices?: (
        character: ICharacter,
    ) => Promise<ICharacterFeatureCustomizationOption[][]>;
}

export interface IPendingDecision {
    type: CharacterPlannerStep;
    choices?: ICharacterFeatureCustomizationOption[][];
    parent: CharacterTreeDecision | CharacterTreeRoot | null;
    loadChoices(character: ICharacter): Promise<ICharacter | null>;
}

export const CharacterDecisionInfo: {
    [key: number | string]: DecisionStateInfo;
} = {
    [CharacterPlannerStep.SET_RACE]: {
        title: 'Select your race',
        event: CharacterPlannerStep.SET_RACE,
        getChoices: async () => [await WeaveApi.getRacesInfo()],
    },
    [CharacterPlannerStep.CHOOSE_SUBRACE]: {
        title: 'Select your subrace',
        event: CharacterPlannerStep.CHOOSE_SUBRACE,
    },
    [CharacterPlannerStep.SET_CLASS]: {
        title: 'Select your starting class',
        event: CharacterPlannerStep.SET_CLASS,
        getChoices: async (character: ICharacter) => [character.classData],
    },
    [CharacterPlannerStep.SET_BACKGROUND]: {
        title: 'Choose a background',
        event: CharacterPlannerStep.SET_BACKGROUND,
        getChoices: async () => [await WeaveApi.getBackgroundsInfo()],
    },
    [CharacterPlannerStep.SET_ABILITY_SCORES]: {
        title: 'Choose your ability scores',
        render: (props) => <AbilitiesPointBuy {...props} />,
        event: CharacterPlannerStep.SET_ABILITY_SCORES,
        getChoices: async () => [],
    },
    [CharacterPlannerStep.CHOOSE_SUBCLASS]: {
        title: 'Choose your subclass',
        event: CharacterPlannerStep.CHOOSE_SUBCLASS,
    },
    [CharacterPlannerStep.LEVEL_UP]: {
        title: 'Select your class',
        event: CharacterPlannerStep.LEVEL_UP,
    },
    [CharacterPlannerStep.MULTICLASS]: {
        title: 'Choose a class to add',
        event: CharacterPlannerStep.MULTICLASS,
    },
    [CharacterPlannerStep.FEAT_SUBCHOICE]: {
        title: 'Customize your feat choice',
        event: CharacterPlannerStep.FEAT_SUBCHOICE,
    },
    [CharacterPlannerStep.FEAT_ABILITY_SCORES]: {
        title: 'Choose an ability score to increase',
        event: CharacterPlannerStep.FEAT_ABILITY_SCORES,
        render: ({ character, ...props }) => {
            const { decision } = props;

            return (
                <AbilitiesIncrease
                    name={decision.parent!.name}
                    abilities={character.getTotalAbilityScores()!}
                    points={(decision.parent as any).points}
                    abilityOptions={decision.choices![0].map(
                        (choice: any) => choice.name,
                    )}
                    {...props}
                />
            );
        },
    },
};
