import React from 'react';
import { Tooltip } from '@mui/material';
import { IActionBase } from '@jorgenswiderski/tomekeeper-shared/dist/types/action';
import {
    Characteristic,
    GrantableEffect,
    GrantableEffectType,
    IActionEffect,
} from '@jorgenswiderski/tomekeeper-shared/dist/types/grantable-effect';
import assert from 'assert';
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

    assert(effect.type === GrantableEffectType.PROFICIENCY);

    return <Tooltip title={effect.description}>{children}</Tooltip>;
}
