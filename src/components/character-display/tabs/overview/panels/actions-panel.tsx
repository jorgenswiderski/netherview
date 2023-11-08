import React, { useMemo } from 'react';
import { Box, Paper } from '@mui/material';
import { ActionEffectType } from '@jorgenswiderski/tomekeeper-shared/dist/types/grantable-effect';
import { TabPanelItem } from '../../../../simple-tabs/tab-panel-item';
import { useCharacter } from '../../../../../context/character-context/character-context';
import { GrantedEffect } from '../../../../character-planner/feature-picker/prospective-effects/granted-effect';

export function ActionsPanel() {
    const { character } = useCharacter();

    const [actions, spells] = useMemo(() => {
        const allActions = character.getActions();

        const spells2 = allActions.filter(
            (action) => action.subtype === ActionEffectType.SPELL_ACTION,
        );

        const actions2 = allActions.filter(
            (action) => action.subtype !== ActionEffectType.SPELL_ACTION,
        );

        if (spells2.length >= 10) {
            return [undefined, spells2];
        }

        return [actions2, spells2];
    }, [character]);

    return (
        <>
            {actions && (
                <TabPanelItem
                    label="Actions"
                    component={Paper}
                    componentProps={{ elevation: 2 }}
                >
                    <Box display="flex" flexDirection="column" gap="0.25rem">
                        {actions.map((action) => (
                            <GrantedEffect effect={action} elevation={3} />
                        ))}
                    </Box>
                </TabPanelItem>
            )}
            {spells && (
                <TabPanelItem
                    label="Learned Spells"
                    component={Paper}
                    componentProps={{ elevation: 2 }}
                    // sx={{ marginTop: '1rem' }}
                >
                    <Box display="flex" flexDirection="column" gap="0.25rem">
                        {spells.map((action) => (
                            <GrantedEffect effect={action} elevation={3} />
                        ))}
                    </Box>
                </TabPanelItem>
            )}
        </>
    );
}
