/* eslint-disable react/jsx-props-no-spreading */
// character-states.ts
import React from 'react';
import AbilitiesPicker from '../../components/character-planner/abilities-picker';
import ClassSelector from '../../components/character-planner/character-class-selector';
import RacePicker from '../../components/character-planner/race-picker';
import { CharacterWidgetProps } from '../../components/character-planner/types';
import { CharacterEvents, CharacterState } from './types';

interface StateInfo {
    title: string;
    render: (props: CharacterWidgetProps) => JSX.Element;
    event: CharacterEvents;
}

export const CharacterStateInfo: {
    [key: number]: StateInfo;
} = {
    [CharacterState.CHOOSE_CLASS]: {
        title: 'Select your starting class',
        render: (props) => <ClassSelector {...props} />,
        event: CharacterEvents.ADD_LEVEL,
    },
    [CharacterState.CHOOSE_RACE]: {
        title: 'Select your race',
        render: (props) => <RacePicker {...props} />,
        event: CharacterEvents.SET_RACE,
    },
    [CharacterState.CHOOSE_ABILITY_SCORES]: {
        title: 'Choose your ability scores',
        render: (props) => <AbilitiesPicker {...props} />,
        event: CharacterEvents.SET_ABILITY_SCORES,
    },
};
