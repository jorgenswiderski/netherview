import React, { useMemo } from 'react';
import {
    ICharacterChoice,
    ICharacterOption,
} from 'planner-types/src/types/character-feature-customization-option';
import styled from '@emotion/styled';
import { GrantableEffect } from 'planner-types/src/types/grantable-effect';
import { Box, Typography } from '@mui/material';
import GrantedEffect from './granted-effect';
import ChoiceDescription from './choice-description';

const EffectsContainer = styled(Box)`
    display: flex;
    flex-direction: column;
    gap: 5px;

    width: 100%;
    margin: 10px 0;
    text-align: center;
`;

const ItemBox = styled(Box)`
    display: flex;
    flex-direction: column;
    gap: 4px;

    padding: 0 0.5rem;
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
            <Typography variant="body2">{text}</Typography>
            <ItemBox>
                {effects
                    .filter((fx) => !fx.hidden)
                    .map((fx) => (
                        <GrantedEffect effect={fx} elevation={4} />
                    ))}
                {choices.map((choice) => (
                    <ChoiceDescription step={choice.type} elevation={4} />
                ))}
            </ItemBox>
        </EffectsContainer>
    );
}
