// character-states.ts
import React from 'react';
import {
    CharacterPlannerStep,
    ICharacterChoice,
    ICharacterOption,
} from '@jorgenswiderski/tomekeeper-shared/dist/types/character-feature-customization-option';
import { WeaveApi } from '../../api/weave/weave';
import { ICharacter } from './types';
import {
    CharacterTreeDecision,
    CharacterTreeRoot,
} from './character-tree-node/character-tree';
import AbilitiesPointBuy from '../../components/character-planner/abilities/abilities-point-buy';
import AbilitiesIncrease from '../../components/character-planner/abilities/abilities-increase';
import SpellPicker from '../../components/character-planner/spell-picker';
import LevelManager from '../../components/level-manager/level-manager';
import { CharacterTreeBackground } from './character-tree-node/character-tree-background';

export interface CharacterWidgetProps {
    onDecision: (
        decision: IPendingDecision,
        value: ICharacterOption | ICharacterOption[],
    ) => void;
    decision: IPendingDecision;
    character: ICharacter;
}

export interface DecisionStateInfo {
    title: string;
    render?: (props: CharacterWidgetProps) => JSX.Element;
    getChoices?: (character: ICharacter) => Promise<ICharacterChoice[]>;
    getOptions?: (character: ICharacter) => Promise<ICharacterOption[]>;
    extraFeaturePickerArgs?: Record<string, any>;
}

export interface IPendingDecision {
    type: CharacterPlannerStep;
    options: ICharacterOption[];
    count: number;
    parent: CharacterTreeDecision | CharacterTreeRoot | null;
    id: string;
}

export const CharacterDecisionInfo: {
    [key: number | string]: DecisionStateInfo;
} = {
    [CharacterPlannerStep.SET_RACE]: {
        title: 'Select your race',
        getOptions: async () => WeaveApi.races.getRacesInfo(),
    },
    [CharacterPlannerStep.CHOOSE_SUBRACE]: {
        title: 'Select your subrace',
    },
    [CharacterPlannerStep.PRIMARY_CLASS]: {
        title: 'Select your starting class',
        getOptions: async (character: ICharacter) =>
            character.getCurrentClassData(),
    },
    [CharacterPlannerStep.SET_BACKGROUND]: {
        title: 'Choose a background',
        getOptions: async () =>
            (await WeaveApi.backgrounds.getBackgroundsInfo()).map(
                (info) => new CharacterTreeBackground(info),
            ),
    },
    [CharacterPlannerStep.SET_ABILITY_SCORES]: {
        title: 'Choose your ability scores',
        render: (props) => <AbilitiesPointBuy {...props} />,
        getOptions: async () => [{ name: 'dummy' }],
    },
    [CharacterPlannerStep.CHOOSE_SUBCLASS]: {
        title: 'Choose your subclass',
    },
    [CharacterPlannerStep.LEVEL_UP]: {
        title: 'Select your class',
    },
    [CharacterPlannerStep.SECONDARY_CLASS]: {
        title: 'Choose a class to add',
    },
    [CharacterPlannerStep.FEAT]: {
        title: 'Choose a feat',
    },
    [CharacterPlannerStep.FEAT_SUBCHOICE]: {
        title: 'Customize your feat choice',
    },
    [CharacterPlannerStep.FEAT_ABILITY_SCORES]: {
        title: 'Choose an ability score to increase',
        render: ({ character, ...props }) => {
            const { decision } = props;

            return (
                <AbilitiesIncrease
                    name={decision.parent!.name}
                    abilities={character.getTotalAbilityScores()!}
                    points={
                        decision.parent!.name === 'Ability Improvement' ? 2 : 1
                    }
                    abilityOptions={decision.options.map(
                        (choice: any) => choice.name,
                    )}
                    {...props}
                />
            );
        },
    },
    [CharacterPlannerStep.LEARN_CANTRIPS]: {
        title: 'Choose cantrips to learn',
        render: (props) => <SpellPicker {...props} />,
    },
    [CharacterPlannerStep.LEARN_SPELLS]: {
        title: 'Choose spells to learn',
        render: (props) => <SpellPicker {...props} />,
    },
    // [CharacterPlannerStep.REMOVE_LEVEL]: {
    //     title: 'Choose a class to remove a level from',
    //     extraFeaturePickerArgs: { negate: true },
    // },
    [CharacterPlannerStep.MANAGE_LEVELS]: {
        title: "Manage your character's levels",
        render: (props) => <LevelManager {...props} />,
    },
};
