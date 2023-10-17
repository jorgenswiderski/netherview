import React from 'react';
import { CharacterPlannerStep } from 'planner-types/src/types/character-feature-customization-option';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import EffectBase from './effect-base';
import { CharacterPlannerStepDescriptions } from '../types';

interface ChoiceDescriptionProps {
    step: CharacterPlannerStep;
    elevation: number;
    style?: React.CSSProperties;
}

export default function ChoiceDescription({
    step,
    elevation,
    style,
}: ChoiceDescriptionProps) {
    const label = CharacterPlannerStepDescriptions.has(step)
        ? CharacterPlannerStepDescriptions.get(step)!
        : `Warning: No description for step type '${step}'.`;

    return (
        <EffectBase
            image={<KeyboardDoubleArrowUpIcon />}
            label={label}
            elevation={elevation}
            style={style}
        />
    );
}
