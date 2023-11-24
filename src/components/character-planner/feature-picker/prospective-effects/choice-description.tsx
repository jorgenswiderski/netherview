import React, { useMemo } from 'react';
import {
    ICharacterChoice,
    ICharacterOption,
} from '@jorgenswiderski/tomekeeper-shared/dist/types/character-feature-customization-option';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import { EffectBase } from './effect-base';
import { characterDecisionInfo } from '../../../../models/character/character-states';
import { WeaveImages } from '../../../../api/weave/weave-images';

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

        return <KeyboardDoubleArrowUpIcon />;
    }, []);

    return (
        <EffectBase
            image={image}
            label={label}
            elevation={elevation}
            style={style}
        />
    );
}
