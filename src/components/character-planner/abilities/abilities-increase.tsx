// abilities-increase.tsx
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
        const { image } = decision.parent as ICharacterOption;

        const bonusAbilities = Object.entries(pointBuyScores)
            .filter(([, value]) => value > 0)
            .map(([key]) => key);

        const choice: ICharacterOption = {
            name,
            grants: [
                {
                    name: `${name}: ${bonusAbilities.join(', ')}`,
                    image,
                    description: `Increases your ${bonusAbilities.join(
                        ' and ',
                    )} ability score${
                        bonusAbilities.length > 1 ? 's' : ''
                    } by ${bonusAbilities.length > 1 ? '1' : '2'}.`,
                    type: GrantableEffectType.PASSIVE,
                    subtype: PassiveType.ABILITY_FEAT,
                    values: { ...pointBuyScores },
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
