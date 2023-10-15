// abilities-point-buy.tsx

import React from 'react';
import { ICharacterFeatureCustomizationOption } from 'planner-types/src/types/character-feature-customization-option';
import {
    GrantableEffectType,
    GrantableEffectSubtype,
} from 'planner-types/src/types/grantable-effect';
import AbilitiesUI from './abilities-ui';
import { AbilityScores } from '../../../models/character/types';
import { AbilitiesCostMode } from './types';

// using 'any' here to resolve cyclic dependency with character-states.tsx
interface CharacterWidgetProps {
    onDecision: (
        decision: any,
        value: ICharacterFeatureCustomizationOption,
    ) => void;
    decision: any;
    points: number;
    name: string;
    abilities: AbilityScores;
    abilityOptions: (keyof AbilityScores)[];
}

export default function AbilitiesPointBuy({
    onDecision,
    decision,
    points,
    name,
    abilities,
    abilityOptions,
}: CharacterWidgetProps) {
    const handleConfirm = (pointBuyScores: AbilityScores) => {
        const choice: ICharacterFeatureCustomizationOption = {
            name,
            grants: [
                {
                    name: `${name}: ${Object.entries(pointBuyScores)
                        .filter(([, value]) => value > 0)
                        .map(([key]) => key)
                        .join(', ')}`,
                    type: GrantableEffectType.CHARACTERISTIC,
                    subtype: GrantableEffectSubtype.ABILITY_FEAT,
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
