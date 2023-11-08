// level-collapsible.tsx
import React, { useMemo } from 'react';
import styled from '@emotion/styled';
import { Box, Paper } from '@mui/material';
import {
    ActionEffectType,
    GrantableEffectType,
    IActionEffect,
} from '@jorgenswiderski/tomekeeper-shared/dist/types/grantable-effect';
import { TabPanelItem } from '../../../simple-tabs/tab-panel-item';
import { CharacterClassLevelInfo } from '../../../../models/character/types';
import { CollapsibleSection } from '../../../collapsible-section';
import { GrantedEffects } from '../../../character-planner/feature-picker/prospective-effects/granted-effects';

const EffectBox = styled(Box)`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 4px;

    padding: 0 0.5rem;
`;

interface ProgressionLevelPanelProps {
    levelInfo: CharacterClassLevelInfo;
}

export function ProgressionLevelPanel({
    levelInfo,
}: ProgressionLevelPanelProps) {
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

    return (
        <TabPanelItem
            label={`${levelInfo.node.name} ${
                (levelInfo.node as any).level + 1
            }`}
            labelVariant="body1"
            component={Paper}
            componentProps={{ elevation: 2 }}
        >
            <EffectBox>
                {spells.length > 2 ? (
                    <CollapsibleSection
                        title="Spells Learned"
                        elevation={3}
                        defaultExpanded={false}
                    >
                        <GrantedEffects effects={spells} flex elevation={4} />
                    </CollapsibleSection>
                ) : (
                    <GrantedEffects effects={spells} flex elevation={4} />
                )}

                <GrantedEffects effects={actions} flex elevation={4} />
            </EffectBox>
        </TabPanelItem>
    );
}
