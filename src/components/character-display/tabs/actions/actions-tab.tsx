import React, { useMemo } from 'react';
import { ActionEffectType } from '@jorgenswiderski/tomekeeper-shared/dist/types/grantable-effect';
import { ISpell } from '@jorgenswiderski/tomekeeper-shared/dist/types/action';
import { Box } from '@mui/material';
import { useCharacter } from '../../../../context/character-context/character-context';
import { TabPanel } from '../../../simple-tabs/tab-panel';
import { TabPanelProps } from '../../../simple-tabs/types';
import { GrantedEffect } from '../../../character-planner/feature-picker/prospective-effects/granted-effect';
import { SpellsByLevel } from '../../../spells-by-level';
import { CollapsibleSection } from '../../../collapsible-section';

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
            <CollapsibleSection title="Spells Learned" elevation={2}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                    }}
                >
                    <SpellsByLevel
                        elevation={3}
                        spells={spells.map((spell) => spell.action as ISpell)}
                    />
                </Box>
            </CollapsibleSection>
            <CollapsibleSection title="Actions" elevation={2}>
                {actions.map((action) => (
                    <GrantedEffect effect={action} elevation={2} />
                ))}
            </CollapsibleSection>
        </TabPanel>
    );
}
