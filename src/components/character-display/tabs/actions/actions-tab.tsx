import React, { useMemo } from 'react';
import { ActionEffectType } from '@jorgenswiderski/tomekeeper-shared/dist/types/grantable-effect';
import { Paper } from '@mui/material';
import { useCharacter } from '../../../../context/character-context/character-context';
import { TabPanel } from '../../../simple-tabs/tab-panel';
import { TabPanelProps } from '../../../simple-tabs/types';
import { GrantedEffects } from '../../../character-planner/feature-picker/prospective-effects/granted-effects';
import { TabPanelItem } from '../../../simple-tabs/tab-panel-item';
import { LearnedSpellsPanel } from './panels/learned-spells-panel';

interface ActionsTabProps extends TabPanelProps {}

export function ActionsTab({ ...panelProps }: ActionsTabProps) {
    const { character } = useCharacter();

    const [spells, actions] = useMemo(() => {
        const allActions = character.getActions();

        return [
            allActions.filter(
                (action) => action.subtype === ActionEffectType.SPELL_ACTION,
            ),
            allActions.filter(
                (action) => action.subtype !== ActionEffectType.SPELL_ACTION,
            ),
        ];
    }, [character]);

    return (
        <TabPanel {...panelProps}>
            {spells.length > 0 && <LearnedSpellsPanel spells={spells} />}

            {actions.length > 0 && (
                <TabPanelItem
                    label="Actions"
                    component={Paper}
                    componentProps={{ elevation: 2 }}
                >
                    <GrantedEffects effects={actions} elevation={3} flex />
                </TabPanelItem>
            )}
        </TabPanel>
    );
}
