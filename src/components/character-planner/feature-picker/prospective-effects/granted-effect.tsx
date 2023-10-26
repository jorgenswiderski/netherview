import React, { useMemo } from 'react';
import {
    ActionEffectType,
    Characteristic,
    GrantableEffect,
    GrantableEffectType,
    IActionEffect,
} from 'planner-types/src/types/grantable-effect';
import { Tooltip } from '@mui/material';
import { ISpell } from 'planner-types/src/types/action';
import EffectBase from './effect-base';
import { SpellTooltip } from '../../../tooltips/spell-tooltip';
import { CharacteristicTooltip } from '../../../tooltips/characteristic-tooltip';
import { WeaveApi } from '../../../../api/weave/weave';
import { log } from '../../../../models/logger';

interface GrantedEffectProps {
    effect: GrantableEffect;
    elevation: number;
    style?: React.CSSProperties;
}

function EffectTooltip({
    effect,
    children,
}: {
    effect: GrantableEffect;
    children: React.ReactElement;
}) {
    const [actionEffect, action] = useMemo(() => {
        return effect.type === GrantableEffectType.ACTION
            ? [effect as IActionEffect, (effect as IActionEffect).action]
            : [null, null];
    }, [effect]);

    if (actionEffect?.subtype === ActionEffectType.SPELL_ACTION) {
        return (
            <SpellTooltip action={action as ISpell}>{children}</SpellTooltip>
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

export default function GrantedEffect({
    effect,
    elevation,
    style,
}: GrantedEffectProps) {
    log(effect);

    const image = useMemo(() => {
        let path: string | undefined;

        if (effect.type === GrantableEffectType.ACTION) {
            const { action } = effect as IActionEffect;

            path = action?.image ?? effect.image;
        } else {
            path = effect.image;
        }

        return path ? WeaveApi.getImagePath(path) : path;
    }, [effect]);

    return (
        <EffectTooltip effect={effect}>
            <div>
                <EffectBase
                    image={image}
                    label={effect.name}
                    elevation={elevation}
                    style={style}
                />
            </div>
        </EffectTooltip>
    );
}
