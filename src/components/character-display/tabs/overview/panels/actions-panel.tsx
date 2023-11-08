import React, { useMemo } from 'react';
import { Paper } from '@mui/material';
import { ActionEffectType } from '@jorgenswiderski/tomekeeper-shared/dist/types/grantable-effect';
import { TabPanelItem } from '../../../../simple-tabs/tab-panel-item';
import { useCharacter } from '../../../../../context/character-context/character-context';
import { GrantedEffects } from '../../../../character-planner/feature-picker/prospective-effects/granted-effects';

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
            return [[], spells2];
        }

        return [actions2, spells2];
    }, [character]);

    return (
        <>
            {actions.length > 0 && (
                <TabPanelItem
                    label="Actions"
                    component={Paper}
                    componentProps={{ elevation: 2 }}
                >
                    <GrantedEffects effects={actions} elevation={3} flex />
                </TabPanelItem>
            )}
            {spells.length > 0 && (
                <TabPanelItem
                    label="Learned Spells"
                    component={Paper}
                    componentProps={{ elevation: 2 }}
                    // sx={{ marginTop: '1rem' }}
                >
                    <GrantedEffects effects={spells} elevation={3} flex />
                </TabPanelItem>
            )}
        </>
    );
}
