import React, { useMemo } from 'react';
import Typography from '@mui/material/Typography';
import {
    ICharacterChoice,
    ICharacterOption,
} from 'planner-types/src/types/character-feature-customization-option';
import styled from '@emotion/styled';
import { GrantableEffect } from 'planner-types/src/types/grantable-effect';
import GrantedEffect from '../granted-effect';
import { CharacterPlannerStepDescriptions } from './types';

const EffectsContainer = styled.div`
    margin: 10px 0;
    text-align: center;
`;

interface ProspectiveEffectsProps {
    options: ICharacterOption | ICharacterOption[];
    text: string;
}

export default function ProspectiveEffects({
    options,
    text,
}: ProspectiveEffectsProps) {
    const effects = useMemo(() => {
        if (Array.isArray(options)) {
            return options
                .flatMap((option) => option?.grants)
                .filter(Boolean) as GrantableEffect[];
        }

        return options.grants ?? [];
    }, [options]);

    const choices = useMemo(() => {
        if (Array.isArray(options)) {
            return options
                .flatMap((option) => option?.choices)
                .filter(Boolean) as ICharacterChoice[];
        }

        return options.choices ?? [];
    }, [options]);

    return (
        <EffectsContainer>
            <Typography variant="body2" style={{ margin: '0 0 5px' }}>
                {text}
            </Typography>
            {effects
                .filter((fx) => !fx.hidden)
                .map((fx) => (
                    <GrantedEffect effect={fx} elevation={4} />
                ))}
            {choices.map((choice) => (
                <Typography variant="body2" style={{ fontWeight: 600 }}>
                    {CharacterPlannerStepDescriptions.get(choice.type)}
                </Typography>
            ))}
        </EffectsContainer>
    );
}
