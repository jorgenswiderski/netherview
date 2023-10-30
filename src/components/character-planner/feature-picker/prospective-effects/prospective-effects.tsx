import React, { useMemo } from 'react';
import {
    ICharacterChoice,
    ICharacterOption,
} from '@jorgenswiderski/tomekeeper-shared/dist/types/character-feature-customization-option';
import styled from '@emotion/styled';
import { GrantableEffect } from '@jorgenswiderski/tomekeeper-shared/dist/types/grantable-effect';
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
    const getEffectsFromOption = (
        option: ICharacterOption,
    ): GrantableEffect[] => {
        const effects = option.grants ? [...option.grants] : [];

        if (option.choices) {
            effects.push(
                ...option.choices
                    .filter((choice) => choice.forcedOptions)
                    .flatMap((choice) => choice.forcedOptions!)
                    .flatMap((opt) => getEffectsFromOption(opt!)),
            );
        }

        return effects;
    };

    const getChoicesFromOption = (
        option: ICharacterOption,
    ): ICharacterChoice[] => {
        const effects = option.choices ? [...option.choices] : [];

        if (option.choices) {
            effects.push(
                ...option.choices
                    .filter((choice) => choice.forcedOptions)
                    .flatMap((choice) => choice.forcedOptions!)
                    .flatMap((opt) => getChoicesFromOption(opt!)),
            );
        }

        return effects;
    };

    const effects = useMemo(() => {
        if (Array.isArray(options)) {
            return options.flatMap((option) => getEffectsFromOption(option));
        }

        return getEffectsFromOption(options) ?? [];
    }, [options]);

    const choices = useMemo(() => {
        if (Array.isArray(options)) {
            return options.flatMap((option) => getChoicesFromOption(option));
        }

        return getChoicesFromOption(options) ?? [];
    }, [options]);

    return (
        <EffectsContainer>
            <Typography variant="body2">{text}</Typography>
            <ItemBox>
                {effects
                    .filter((fx) => !fx.hidden)
                    .map((fx) => (
                        <GrantedEffect
                            key={`${fx.name}-${fx.description}`}
                            effect={fx}
                            elevation={4}
                        />
                    ))}
                {choices
                    .filter((choice) => !choice.forcedOptions)
                    .map((choice) => (
                        <ChoiceDescription
                            key={choice.type}
                            step={choice.type}
                            elevation={4}
                        />
                    ))}
            </ItemBox>
        </EffectsContainer>
    );
}
