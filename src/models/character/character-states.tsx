/* eslint-disable react/jsx-props-no-spreading */
// character-states.ts
import React from 'react';
import AbilitiesPicker from '../../components/character-planner/abilities-picker';
import { CharacterWidgetProps } from '../../components/character-planner/types';
import { CharacterEvents } from './types';
import { ICharacterFeatureCustomizationOption } from '../../components/character-planner/feature-picker/types';
import { WeaveApi } from '../../api/weave/weave';

export interface DecisionStateInfo {
    title: string;
    render?: (props: CharacterWidgetProps) => JSX.Element;
    event: CharacterEvents;
    getChoices?: () => Promise<ICharacterFeatureCustomizationOption[][]>;
}

export interface CharacterDecision {
    type: CharacterEvents;
    choices?: ICharacterFeatureCustomizationOption[][];
}

export const CharacterDecisionInfo: {
    [key: number]: DecisionStateInfo;
} = {
    [CharacterEvents.SET_RACE]: {
        title: 'Select your race',
        event: CharacterEvents.SET_RACE,
        getChoices: async () => [await WeaveApi.getRacesInfo()],
    },
    [CharacterEvents.SET_SUBRACE]: {
        title: 'Select your subrace',
        event: CharacterEvents.SET_SUBRACE,
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
};
