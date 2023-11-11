import React from 'react';
import { GrantableEffect } from '@jorgenswiderski/tomekeeper-shared/dist/types/grantable-effect';
import { Box } from '@mui/material';
import { GrantedEffect } from './granted-effect';

interface GrantedEffectsProps {
    effects: GrantableEffect[];
    flex?: boolean;
    elevation?: number;
}

export function GrantedEffects({
    effects,
    flex,
    elevation = 4,
}: GrantedEffectsProps) {
    return flex ? (
        <Box display="flex" flexDirection="column" gap="0.25rem">
            {effects
                .filter((fx) => !fx.hidden)
                .map((fx) => (
                    <GrantedEffect
                        key={`${fx.name}-${fx.description}`}
                        effect={fx}
                        elevation={elevation}
                    />
                ))}
        </Box>
    ) : (
        effects
            .filter((fx) => !fx.hidden)
            .map((fx) => (
                <GrantedEffect
                    key={`${fx.name}-${fx.description}`}
                    effect={fx}
                    elevation={elevation}
                />
            ))
    );
}
