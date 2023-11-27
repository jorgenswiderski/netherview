// abilities-point-buy.tsx

import React from 'react';
import { ICharacterOption } from '@jorgenswiderski/tomekeeper-shared/dist/types/character-feature-customization-option';
import {
    GrantableEffectType,
    PassiveType,
} from '@jorgenswiderski/tomekeeper-shared/dist/types/grantable-effect';
import { AbilitiesUI } from './abilities-ui';
import { AbilityScores } from '../../../models/character/types';
import { AbilitiesCostMode } from './types';
import { IPendingDecision } from '../../../models/character/character-states';

interface CharacterWidgetProps {
    title: string;
    onDecision: (decision: IPendingDecision, value: ICharacterOption) => void;
    decision: IPendingDecision;
    points: number;
    name: string;
    abilities: AbilityScores;
    abilityOptions: (keyof AbilityScores)[];
}

export function AbilitiesIncrease({
    title,
    onDecision,
    decision,
    points,
    name,
    abilities,
    abilityOptions,
}: CharacterWidgetProps) {
    const handleConfirm = (pointBuyScores: AbilityScores) => {
        const choice: ICharacterOption = {
            name,
            grants: [
                {
                    name: `${name}: ${Object.entries(pointBuyScores)
                        .filter(([, value]) => value > 0)
                        .map(([key]) => key)
                        .join(', ')}`,
                    type: GrantableEffectType.PASSIVE,
                    subtype: PassiveType.ABILITY_FEAT,
                    values: { ...pointBuyScores },
                    hidden: true,
                },
            ],
        };

        // Call the event with the abilities and the racial bonuses
        onDecision(decision, choice);
    };

    return (
        <div>
            <AbilitiesUI
                title={title}
                costMode={AbilitiesCostMode.CONSTANT}
                onDecision={handleConfirm}
                pointsAvailable={points}
                scoreLimit={20}
                dots={20}
                baseAbilities={abilities}
                abilityOptions={abilityOptions}
            />
        </div>
    );
}
