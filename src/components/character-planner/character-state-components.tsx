import React from 'react';
import {
    CharacterPlannerStep,
    ICharacterOption,
} from '@jorgenswiderski/tomekeeper-shared/dist/types/character-feature-customization-option';
import { AbilitiesIncrease } from './abilities/abilities-increase';
import { AbilitiesPointBuy } from './abilities/abilities-point-buy';
import { SpellPicker } from './spell-picker';
import { LevelManager } from '../level-manager/level-manager';
import { IPendingDecision } from '../../models/character/character-states';
import { ICharacter } from '../../models/character/types';

export interface CharacterWidgetProps {
    title: string;
    onDecision: (
        decision: IPendingDecision,
        value: ICharacterOption | ICharacterOption[],
    ) => void;
    decision: IPendingDecision;
    character: ICharacter;
}

export const characterStateComponents: Record<
    number,
    (props: CharacterWidgetProps) => JSX.Element
> = {
    [CharacterPlannerStep.SET_ABILITY_SCORES]: (props) => (
        <AbilitiesPointBuy {...props} />
    ),

    [CharacterPlannerStep.FEAT_ABILITY_SCORES]: ({ character, ...props }) => {
        const { decision } = props;

        return (
            <AbilitiesIncrease
                name={decision.parent!.name}
                abilities={character.getTotalAbilityScores()!}
                points={decision.parent!.name === 'Ability Improvement' ? 2 : 1}
                abilityOptions={decision.options.map(
                    (choice: any) => choice.name,
                )}
                {...props}
            />
        );
    },
    [CharacterPlannerStep.LEARN_CANTRIPS]: (props) => (
        <SpellPicker {...props} />
    ),

    [CharacterPlannerStep.LEARN_SPELLS]: (props) => <SpellPicker {...props} />,

    [CharacterPlannerStep.MANAGE_LEVELS]: (props) => (
        <LevelManager {...props} />
    ),

    [CharacterPlannerStep.CLASS_FEATURE_LEARN_SPELL]: (props) => (
        <SpellPicker {...props} />
    ),
};
