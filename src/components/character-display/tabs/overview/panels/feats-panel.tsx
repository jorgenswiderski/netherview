import React, { useMemo } from 'react';
import { Box, Paper } from '@mui/material';
import { useCharacter } from '../../../../../context/character-context/character-context';
import { GrantedEffect } from '../../../../character-planner/feature-picker/prospective-effects/granted-effect';
import { TabPanelItem } from '../../../../simple-tabs/tab-panel-item';

export function FeatsPanel() {
    const { character } = useCharacter();

    const feats = useMemo(() => character.getFeats(), [character]);

    if (feats.length === 0) {
        return null;
    }

    return (
        <TabPanelItem
            label="Feats"
            component={Paper}
            componentProps={{ elevation: 2 }}
        >
            <Box display="flex" flexDirection="column" gap="0.25rem">
                {feats.map((feat) => (
                    <GrantedEffect effect={feat} elevation={3} />
                ))}
            </Box>
        </TabPanelItem>
    );
}
