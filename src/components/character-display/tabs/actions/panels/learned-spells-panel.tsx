import React from 'react';
import { ISpell } from '@jorgenswiderski/tomekeeper-shared/dist/types/action';
import { Paper, Box } from '@mui/material';
import { IActionEffect } from '@jorgenswiderski/tomekeeper-shared/dist/types/grantable-effect';
import { TabPanelItem } from '../../../../simple-tabs/tab-panel-item';
import { SpellsByLevel } from '../../../../spells-by-level';

interface LearnedSpellsPanelProps {
    spells: IActionEffect[];
}

export function LearnedSpellsPanel({ spells }: LearnedSpellsPanelProps) {
    return (
        <TabPanelItem
            label="Learned Spells"
            component={Paper}
            componentProps={{ elevation: 2 }}
        >
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
        </TabPanelItem>
    );
}
