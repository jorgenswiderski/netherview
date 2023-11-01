import React, { useMemo } from 'react';
import {
    GrantableEffect,
    GrantableEffectType,
    IActionEffect,
} from '@jorgenswiderski/tomekeeper-shared/dist/types/grantable-effect';
import EffectBase from './effect-base';
import { GrantedEffectTooltip } from '../../../tooltips/granted-effect-tooltip';
import { Utils } from '../../../../models/utils';

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

        return path ? Utils.getMediaWikiImagePath(path) : path;
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
