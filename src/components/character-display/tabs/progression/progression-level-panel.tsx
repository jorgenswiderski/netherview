import React, { useMemo } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import {
    ActionEffectType,
    Characteristic,
    CharacteristicType,
    GrantableEffect,
    GrantableEffectType,
    IActionEffect,
} from '@jorgenswiderski/tomekeeper-shared/dist/types/grantable-effect';
import styled from '@emotion/styled';
import { TabPanelItem } from '../../../simple-tabs/tab-panel-item';
import { CharacterClassLevelInfo } from '../../../../models/character/types';
import { GrantedEffects } from '../../../character-planner/feature-picker/prospective-effects/granted-effects';
import { ProgressionPanelSection } from './progression-panel-sections/progression-panel-section';
import { SpellsProgressionSection } from './progression-panel-sections/spells-progression-section';
import { SpellIconCard } from '../../../icon-cards/spell-icon-card';
import { GrantedEffectIconCard } from '../../../icon-cards/granted-effect-icon-card';

const StyledTabPanelItem = styled(TabPanelItem)`
    padding: 0.5rem 1rem;
`;

interface ProgressionLevelPanelProps {
    levelInfo: CharacterClassLevelInfo;
}

export function ProgressionLevelPanel({
    levelInfo,
}: ProgressionLevelPanelProps) {
    const collapsed = true;

    const [spells, actions] = useMemo(() => {
        const allActions = levelInfo.totalEffects.filter(
            (effect) => effect.type === GrantableEffectType.ACTION,
        ) as IActionEffect[];

        return [
            allActions.filter(
                (action) => action.subtype === ActionEffectType.SPELL_ACTION,
            ),
            allActions.filter(
                (action) => action.subtype !== ActionEffectType.SPELL_ACTION,
            ),
        ];
    }, [levelInfo.totalEffects]);

    const [characteristics, feats] = useMemo(() => {
        const allCharacteristics = levelInfo.totalEffects.filter(
            (effect) => effect.type === GrantableEffectType.CHARACTERISTIC,
        ) as Characteristic[];

        const feats2 = allCharacteristics.filter(
            (effect) => effect.subtype === CharacteristicType.ABILITY_FEAT,
        );

        const chars = allCharacteristics.filter(
            (effect) => effect.subtype !== CharacteristicType.ABILITY_FEAT,
        );

        return [chars, feats2];
    }, [levelInfo.totalEffects]);

    const collapseEntries: { label: string; effects: GrantableEffect[] }[] = [
        { label: 'Spells', effects: spells },
        { label: 'Actions', effects: actions },
        { label: 'Characteristics', effects: characteristics },
        { label: 'Feats', effects: feats },
    ];

    return (
        <StyledTabPanelItem component={Paper} componentProps={{ elevation: 2 }}>
            {collapsed && (
                <Box display="flex" gap="0.5rem" alignItems="center">
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        mr={1}
                    >
                        <Typography variant="body2" color="gray">
                            {levelInfo.node.name}
                        </Typography>
                        <Typography variant="h6">
                            {(levelInfo.node as any).level + 1}
                        </Typography>
                    </Box>

                    {collapseEntries
                        .filter(({ effects }) => effects.length > 0)
                        .map(({ label, effects }) => (
                            <Paper
                                sx={{
                                    padding: '0.5rem',
                                    flex: 1,
                                }}
                            >
                                <Typography variant="caption" color="GrayText">
                                    {label}
                                </Typography>

                                <Box display="flex" gap="0.25rem">
                                    {effects.map((effect) => {
                                        if ((effect as any)?.action) {
                                            return (
                                                <SpellIconCard
                                                    spell={
                                                        (effect as any).action
                                                    }
                                                />
                                            );
                                        }

                                        return (
                                            <GrantedEffectIconCard
                                                effect={effect}
                                            />
                                        );
                                    })}
                                </Box>
                            </Paper>
                        ))}
                </Box>
            )}

            {!collapsed && (
                <Box display="flex" gap="0.5rem" flexWrap="wrap">
                    {spells.length > 0 && (
                        <SpellsProgressionSection spells={spells} />
                    )}

                    {actions.length > 0 && (
                        <ProgressionPanelSection label="Class Actions">
                            <GrantedEffects
                                effects={actions}
                                flex
                                elevation={4}
                            />
                        </ProgressionPanelSection>
                    )}

                    {characteristics.length > 0 && (
                        <ProgressionPanelSection label="Characteristics">
                            <GrantedEffects
                                effects={characteristics}
                                flex
                                elevation={4}
                            />
                        </ProgressionPanelSection>
                    )}
                </Box>
            )}
        </StyledTabPanelItem>
    );
}
