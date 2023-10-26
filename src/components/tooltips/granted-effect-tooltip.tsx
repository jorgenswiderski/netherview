import React from 'react';
import { Tooltip } from '@mui/material';
import { IActionBase } from 'planner-types/src/types/action';
import {
    Characteristic,
    GrantableEffect,
    GrantableEffectType,
    IActionEffect,
} from 'planner-types/src/types/grantable-effect';
import { ActionTooltip } from './action-tooltip';
import { CharacteristicTooltip } from './characteristic-tooltip';

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
            <CharacteristicTooltip characteristic={effect as Characteristic}>
                {children}
            </CharacteristicTooltip>
        );
    }

    return <Tooltip title={effect.description}>{children}</Tooltip>;
}
