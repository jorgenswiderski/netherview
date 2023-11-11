import React, { useMemo } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import {
    ActionEffectType,
    Characteristic,
    GrantableEffect,
    GrantableEffectType,
    IActionEffect,
} from '@jorgenswiderski/tomekeeper-shared/dist/types/grantable-effect';
import styled from '@emotion/styled';
import { CharacterPlannerStep } from '@jorgenswiderski/tomekeeper-shared/dist/types/character-feature-customization-option';
import { TabPanelItem } from '../../../simple-tabs/tab-panel-item';
import { CharacterClassLevelInfo } from '../../../../models/character/types';
import { GrantedEffects } from '../../../character-planner/feature-picker/prospective-effects/granted-effects';
import { ProgressionPanelSection } from './progression-panel-sections/progression-panel-section';
import { SpellsProgressionSection } from './progression-panel-sections/spells-progression-section';
import { SpellIconCard } from '../../../icon-cards/spell-icon-card';
import { GrantedEffectIconCard } from '../../../icon-cards/granted-effect-icon-card';
import { Character } from '../../../../models/character/character';
import { CharacterTreeDecision } from '../../../../models/character/character-tree-node/character-tree';

const StyledTabPanelItem = styled(TabPanelItem)`
    padding: 0.5rem 1rem;
`;

interface ProgressionLevelPanelProps {
    level: number;
    levelInfo: CharacterClassLevelInfo;
    multiclassed: boolean;
}

export function ProgressionLevelPanel({
    level = 1,
    levelInfo,
    multiclassed,
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

    const feats = useMemo(() => {
        const featNode = levelInfo.node.children?.find(
            (child) => child.type === CharacterPlannerStep.FEAT,
        ) as CharacterTreeDecision | undefined;

        if (!featNode) {
            return [];
        }

        return [Character.getFeatAsEffect(featNode)];
    }, [levelInfo.node]);

    const characteristics = useMemo(
        () =>
            (
                levelInfo.totalEffects.filter(
                    (effect) =>
                        effect.type === GrantableEffectType.CHARACTERISTIC,
                ) as Characteristic[]
            ).filter((effect) => !feats.includes(effect)),
        [levelInfo.totalEffects, feats],
    );

    const effectGroups: { label: string; effects: GrantableEffect[] }[] = [
        { label: 'Feats', effects: feats },
        { label: 'Actions', effects: actions },
        { label: 'Spells', effects: spells },
        { label: 'Characteristics', effects: characteristics },
    ];

    return (
        <StyledTabPanelItem component={Paper} componentProps={{ elevation: 2 }}>
            {collapsed && (
                <Box
                    display="flex"
                    gap="0.5rem"
                    alignItems="center"
                    flexWrap="wrap"
                >
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        mr={1}
                    >
                        {!multiclassed && (
                            <Typography variant="body2" color="gray">
                                Level
                            </Typography>
                        )}
                        <Typography variant="h6">{level}</Typography>
                        {multiclassed && (
                            <Typography variant="body2" color="gray">
                                {`${levelInfo.node.name} ${
                                    (levelInfo.node as any).level + 1
                                }`}
                            </Typography>
                        )}
                    </Box>

                    {effectGroups
                        .filter(({ effects }) => effects.length > 0)
                        .map(({ label, effects }) => (
                            <Paper
                                key={label}
                                sx={{
                                    padding: '0.25rem 0.5rem 0.5rem',
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
                                                    key={effect.name}
                                                    spell={
                                                        (effect as any).action
                                                    }
                                                />
                                            );
                                        }

                                        return (
                                            <GrantedEffectIconCard
                                                key={effect.name}
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
