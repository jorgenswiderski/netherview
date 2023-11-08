import React, { useMemo } from 'react';
import { Paper } from '@mui/material';
import { useCharacter } from '../../../../../context/character-context/character-context';
import { TabPanelItem } from '../../../../simple-tabs/tab-panel-item';
import { GrantedEffects } from '../../../../character-planner/feature-picker/prospective-effects/granted-effects';

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
            <GrantedEffects effects={feats} elevation={3} flex />
        </TabPanelItem>
    );
}
