import React from 'react';
import {
    Characteristic,
    GrantableEffect,
    GrantableEffectType,
} from 'planner-types/src/types/grantable-effect';
import { Tooltip } from '@mui/material';
import EffectBase from './effect-base';
import { SpellTooltip } from '../../../tooltips/spell-tooltip';
import { CharacteristicTooltip } from '../../../tooltips/characteristic-tooltip';
import { CharacterTreeSpellEffect } from '../../../../models/character/character-tree-node/character-tree-spell-effect';

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
    // if (effect.type === GrantableEffectType.ACTION) {
    if (effect.constructor.name === 'CharacterTreeSpellEffect') {
        return (
            <SpellTooltip action={(effect as CharacterTreeSpellEffect).spell}>
                {children}
            </SpellTooltip>
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
    return (
        <EffectTooltip effect={effect}>
            <div>
                <EffectBase
                    image={effect.image}
                    label={effect.name}
                    elevation={elevation}
                    style={style}
                />
            </div>
        </EffectTooltip>
    );
}
