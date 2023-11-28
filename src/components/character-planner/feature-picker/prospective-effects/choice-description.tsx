import React, { useMemo } from 'react';
import {
    ICharacterChoice,
    ICharacterOption,
} from '@jorgenswiderski/tomekeeper-shared/dist/types/character-feature-customization-option';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import {
    GrantableEffectType,
    IPassive,
} from '@jorgenswiderski/tomekeeper-shared/dist/types/grantable-effect';
import { EffectBase } from './effect-base';
import { characterDecisionInfo } from '../../../../models/character/character-states';
import { WeaveImages } from '../../../../api/weave/weave-images';
import { PassiveTooltip } from '../../../tooltips/passive-tooltip';

interface ChoiceDescriptionProps {
    option: ICharacterOption;
    choice: ICharacterChoice;
    elevation: number;
    style?: React.CSSProperties;
}

export function ChoiceDescription({
    option,
    choice,
    elevation,
    style,
}: ChoiceDescriptionProps) {
    const isLevelOption = typeof (option as any).level !== 'undefined';

    const label =
        characterDecisionInfo[choice.type]?.description(option, choice) ??
        `Warning: No description for step type '${choice.type}'.`;

    const image = useMemo(() => {
        const decisionImage = characterDecisionInfo[choice.type]?.image?.(
            option,
            choice,
        );

        if (decisionImage) {
            return WeaveImages.getPath(decisionImage, 24);
        }

        if (!isLevelOption && option.image) {
            return WeaveImages.getPath(option.image, 24);
        }

        return <KeyboardDoubleArrowUpIcon />;
    }, []);

    const passive: IPassive | undefined =
        isLevelOption || !option?.description
            ? undefined
            : {
                  name: option.name,
                  image: option.image,
                  description: option.description,
                  type: GrantableEffectType.PASSIVE,
                  id: 0,
              };

    return (
        <PassiveTooltip passive={passive}>
            <EffectBase
                image={image}
                label={label}
                elevation={elevation}
                style={style}
            />
        </PassiveTooltip>
    );
}
