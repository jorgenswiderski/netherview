import React, { useMemo } from 'react';
import {
    GrantableEffect,
    GrantableEffectType,
    IActionEffect,
} from 'planner-types/src/types/grantable-effect';
import EffectBase from './effect-base';
import { WeaveApi } from '../../../../api/weave/weave';
import { GrantedEffectTooltip } from '../../../tooltips/granted-effect-tooltip';

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
        <GrantedEffectTooltip effect={effect}>
            <div>
                <EffectBase
                    image={image}
                    label={effect.name}
                    elevation={elevation}
                    style={style}
                />
            </div>
        </GrantedEffectTooltip>
    );
}
