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
import { AbilitiesPointBuy } from '../../components/character-planner/abilities/abilities-point-buy';
import { AbilitiesIncrease } from '../../components/character-planner/abilities/abilities-increase';
import { SpellPicker } from '../../components/character-planner/spell-picker';
import { LevelManager } from '../../components/level-manager/level-manager';
import { CharacterTreeBackground } from './character-tree-node/character-tree-background';

export interface CharacterWidgetProps {
    title: string;
    onDecision: (
        decision: IPendingDecision,
        value: ICharacterOption | ICharacterOption[],
    ) => void;
    decision: IPendingDecision;
    character: ICharacter;
}

export interface DecisionStateInfo {
    title: (decision: IPendingDecision) => string;
    description: (option: ICharacterOption, choice: ICharacterChoice) => string;
    image?: (
        option: ICharacterOption,
        choice: ICharacterChoice,
    ) => string | undefined;
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

export const characterDecisionInfo: Record<number, DecisionStateInfo> = {
    [CharacterPlannerStep.SET_RACE]: {
        title: () => 'Select your race',
        description: () => "Select your character's race.",
        getOptions: async () => WeaveApi.races.getRacesInfo(),
    },
    [CharacterPlannerStep.CHOOSE_SUBRACE]: {
        title: () => 'Select your subrace',
        description: () => 'Pick a subrace for your character.',
    },
    [CharacterPlannerStep.PRIMARY_CLASS]: {
        title: () => 'Select your starting class',
        description: () => "Choose your character's class.",
        getOptions: async (character: ICharacter) =>
            character.getCurrentClassData(),
    },
    [CharacterPlannerStep.SET_BACKGROUND]: {
        title: () => 'Choose a background',
        description: () => "Determine your character's background.",
        getOptions: async () =>
            (await WeaveApi.backgrounds.getBackgroundsInfo()).map(
                (info) => new CharacterTreeBackground(info),
            ),
    },
    [CharacterPlannerStep.SET_ABILITY_SCORES]: {
        title: () => 'Choose your ability scores',
        description: () => 'Assign ability scores for your character.',
        render: (props) => <AbilitiesPointBuy {...props} />,
        getOptions: async () => [{ name: 'dummy' }],
    },
    [CharacterPlannerStep.CHOOSE_SUBCLASS]: {
        title: () => 'Choose your subclass',
        description: () =>
            'Select a subclass specialization for your character.',
    },
    [CharacterPlannerStep.LEVEL_UP]: {
        title: () => 'Select your class',
        description: () => 'Level up your character.',
    },
    [CharacterPlannerStep.SECONDARY_CLASS]: {
        title: () => 'Choose a class to add',
        description: () => 'Choose an additional class for your character.',
    },
    [CharacterPlannerStep.FEAT]: {
        title: () => 'Choose a feat',
        description: () =>
            'Select a Feat or gain an ability score improvement.',
    },
    [CharacterPlannerStep.FEAT_SUBCHOICE]: {
        title: () => 'Customize your feat choice',
        description: () => 'Additional feat customization options.',
    },
    [CharacterPlannerStep.FEAT_ABILITY_SCORES]: {
        title: () => 'Choose an ability score to increase',
        description: () => 'Increase an ability score.',
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
        title: () => 'Choose cantrips to learn',
        description: () => 'Choose additional cantrips to learn.',
        render: (props) => <SpellPicker {...props} />,
    },
    [CharacterPlannerStep.LEARN_SPELLS]: {
        title: () => 'Choose spells to learn',
        description: () => 'Choose additional spells to learn.',
        render: (props) => <SpellPicker {...props} />,
    },
    // [CharacterPlannerStep.REMOVE_LEVEL]: {
    //     title: () => 'Choose a class to remove a level from',
    //     extraFeaturePickerArgs: { negate: true },
    // },
    [CharacterPlannerStep.MANAGE_LEVELS]: {
        title: () => "Manage your character's levels",
        description: () => "Manage your character's levels",
        render: (props) => <LevelManager {...props} />,
    },
    [CharacterPlannerStep.CLASS_FEATURE_SUBCHOICE]: {
        title: (decision: IPendingDecision) =>
            `Select a ${decision.parent!.name} option`,
        description: (option: ICharacterOption) =>
            `Select a ${option.name} option`,
        image: (option: ICharacterOption, choice: ICharacterChoice) =>
            option.image ??
            choice.options[0].image ??
            choice.options[0].grants?.[0].image,
    },
};
