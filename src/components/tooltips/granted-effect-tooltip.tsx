import React from 'react';
import { Tooltip } from '@mui/material';
import { IActionBase } from '@jorgenswiderski/tomekeeper-shared/dist/types/action';
import {
    ICharacteristic,
    GrantableEffect,
    GrantableEffectType,
    IActionEffect,
} from '@jorgenswiderski/tomekeeper-shared/dist/types/grantable-effect';
import { ActionTooltip } from './action-tooltip';
import { CharacteristicTooltip } from './characteristic-tooltip';
import { safeAssert } from '../../models/utils';

export function GrantedEffectTooltip({
    effect,
    children,
}: {
    effect: GrantableEffect;
    children: React.ReactElement;
}) {
    if (effect.type === GrantableEffectType.ACTION) {
        return (
            <ActionTooltip
                action={(effect as IActionEffect).action as IActionBase}
            >
                {children}
            </ActionTooltip>
        );
    }

    if (effect.type === GrantableEffectType.CHARACTERISTIC) {
        return (
            <CharacteristicTooltip characteristic={effect as ICharacteristic}>
                {children}
            </CharacteristicTooltip>
        );
    }

    safeAssert(
        effect.type === GrantableEffectType.PROFICIENCY,
        `Granted effect (${effect.name}) should have a valid type (${effect.type})`,
    );

    return <Tooltip title={effect.description}>{children}</Tooltip>;
}
