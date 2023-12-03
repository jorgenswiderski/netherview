import React, { useMemo } from 'react';
import { Paper } from '@mui/material';
import { useCharacter } from '../../../../../context/character-context/character-context';
import { TabPanelItem } from '../../../../simple-tabs/tab-panel-item';
import { GrantedEffects } from '../../../../character-planner/feature-picker/prospective-effects/granted-effects';

export function MetamagicsPanel() {
    const { character } = useCharacter();

    const metamagics = useMemo(
        () =>
            character
                .getPassives()
                .filter((effect) => !effect.hidden)
                .filter((effect) => effect.name.match(/^Metamagic: /)),
        [character],
    );

    if (metamagics.length === 0) {
        return null;
    }

    return (
        <TabPanelItem
            label="Metamagics"
            component={Paper}
            componentProps={{ elevation: 2 }}
        >
            <GrantedEffects effects={metamagics} elevation={3} flex />
        </TabPanelItem>
    );
}
