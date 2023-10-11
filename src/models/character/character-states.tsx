/* eslint-disable react/jsx-props-no-spreading */
// character-states.ts
import React from 'react';
import {
    CharacterEvents,
    ICharacterFeatureCustomizationOption,
} from 'planner-types/src/types/character-feature-customization-option';
import AbilitiesPicker from '../../components/character-planner/abilities-picker';
import { CharacterWidgetProps } from '../../components/character-planner/types';
import { WeaveApi } from '../../api/weave/weave';

export interface DecisionStateInfo {
    title: string;
    render?: (props: CharacterWidgetProps) => JSX.Element;
    event: CharacterEvents;
    getChoices?: (
        character: any,
    ) => Promise<ICharacterFeatureCustomizationOption[][]>;
}

export interface CharacterDecision {
    type: CharacterEvents;
    choices?: ICharacterFeatureCustomizationOption[][];
}

export const CharacterDecisionInfo: {
    [key: number | string]: DecisionStateInfo;
} = {
    [CharacterEvents.SET_RACE]: {
        title: 'Select your race',
        event: CharacterEvents.SET_RACE,
        getChoices: async () => [await WeaveApi.getRacesInfo()],
    },
    [CharacterEvents.CHOOSE_SUBRACE]: {
        title: 'Select your subrace',
        event: CharacterEvents.CHOOSE_SUBRACE,
    },
    [CharacterEvents.SET_CLASS]: {
        title: 'Select your starting class',
        event: CharacterEvents.SET_CLASS,
        getChoices: async () => [await WeaveApi.getClassesInfo()],
    },
    [CharacterEvents.SET_BACKGROUND]: {
        title: 'Choose a background',
        event: CharacterEvents.SET_BACKGROUND,
        getChoices: async () => [await WeaveApi.getBackgroundsInfo()],
    },
    [CharacterEvents.SET_ABILITY_SCORES]: {
        title: 'Choose your ability scores',
        render: (props) => <AbilitiesPicker {...props} />,
        event: CharacterEvents.SET_ABILITY_SCORES,
        getChoices: async () => [],
    },
    [CharacterEvents.CHOOSE_SUBCLASS]: {
        title: 'Choose your subclass',
        event: CharacterEvents.CHOOSE_SUBCLASS,
    },
    [CharacterEvents.LEVEL_UP]: {
        title: 'Select your class',
        event: CharacterEvents.LEVEL_UP,
    },
    [CharacterEvents.MULTICLASS]: {
        title: 'Choose a class to add',
        event: CharacterEvents.MULTICLASS,
    },
};
