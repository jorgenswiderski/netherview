import React from 'react';
import { GrantableEffect } from 'planner-types/src/types/grantable-effect';
import EffectBase from './effect-base';

interface GrantedEffectProps {
    effect: GrantableEffect;
    elevation: number;
    style?: React.CSSProperties;
}

export default function GrantedEffect({
    effect,
    elevation,
    style,
}: GrantedEffectProps) {
    return (
        <EffectBase
            tooltip={effect.description}
            image={effect.image}
            label={effect.name}
            elevation={elevation}
            style={style}
        />
    );
}
