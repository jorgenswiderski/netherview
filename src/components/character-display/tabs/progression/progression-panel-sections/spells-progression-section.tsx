import React from 'react';
import { IActionEffect } from '@jorgenswiderski/tomekeeper-shared/dist/types/grantable-effect';
import { ISpell } from '@jorgenswiderski/tomekeeper-shared/dist/types/action';
import { Box } from '@mui/material';
import { GrantedEffects } from '../../../../character-planner/feature-picker/prospective-effects/granted-effects';
import { ProgressionPanelSection } from './progression-panel-section';
import { SpellIconCard } from '../../../../icon-cards/spell-icon-card';

interface SpellsProgressionSectionProps {
    spells: IActionEffect[];
}

export function SpellsProgressionSection({
    spells,
}: SpellsProgressionSectionProps) {
    return (
        <ProgressionPanelSection label="Spells Learned">
            {spells.length > 2 ? (
                <Box display="flex" gap="0.5rem">
                    {spells.map((spell) => (
                        <SpellIconCard
                            spell={spell.action as ISpell}
                            elevation={4}
                        />
                    ))}
                </Box>
            ) : (
                <GrantedEffects effects={spells} flex elevation={4} />
            )}
        </ProgressionPanelSection>
    );
}
