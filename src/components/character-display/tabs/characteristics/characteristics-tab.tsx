import React, { useMemo } from 'react';
import styled from '@emotion/styled';
import { Characteristic } from '@jorgenswiderski/tomekeeper-shared/dist/types/grantable-effect';
import { CharacterPlannerStep } from '@jorgenswiderski/tomekeeper-shared/dist/types/character-feature-customization-option';
import { Paper } from '@mui/material';
import { TabPanel } from '../../../simple-tabs/tab-panel';
import { TabPanelProps } from '../../../simple-tabs/types';
import { useCharacter } from '../../../../context/character-context/character-context';
import { GrantedEffects } from '../../../character-planner/feature-picker/prospective-effects/granted-effects';
import {
    CharacterTreeDecision,
    CharacterTreeEffect,
} from '../../../../models/character/character-tree-node/character-tree';
import { TabPanelItem } from '../../../simple-tabs/tab-panel-item';
import { safeAssert } from '../../../../models/utils';

const StyledTabPanel = styled(TabPanel)``;

const StyledTabPanelItem = styled(TabPanelItem)`
    break-inside: auto;
`;

const labels: Record<string, CharacterPlannerStep[]> = {
    Class: [
        CharacterPlannerStep.PRIMARY_CLASS,
        CharacterPlannerStep.SECONDARY_CLASS,
        CharacterPlannerStep.LEVEL_UP,
    ],
    Subclass: [
        CharacterPlannerStep.CHOOSE_SUBCLASS,
        CharacterPlannerStep.SUBCLASS_FEATURE,
    ],
    Racial: [
        CharacterPlannerStep.SET_RACE,
        CharacterPlannerStep.CHOOSE_SUBRACE,
    ],
    Feats: [
        CharacterPlannerStep.FEAT,
        CharacterPlannerStep.FEAT_SUBCHOICE,
        CharacterPlannerStep.FEAT_ABILITY_SCORES,
    ],
    Items: [CharacterPlannerStep.EQUIP_ITEM],
};

const labels2: Record<number, string> = Object.entries(labels).reduce(
    (acc, [label, steps]) => {
        steps.forEach((step) => {
            acc[step] = label;
        });

        return acc;
    },
    {} as Record<number, string>,
);

interface CharacteristicsTabProps extends TabPanelProps {}

export function CharacteristicsTab({ ...panelProps }: CharacteristicsTabProps) {
    const { character } = useCharacter();

    const characteristics = useMemo(
        () => character.getCharacteristics(),
        [character],
    );

    const effectGroups = useMemo(() => {
        const m: Record<string | number, Characteristic[]> = {};

        characteristics.forEach((c) => {
            if (c.hidden) {
                return;
            }

            const { parent } = c as CharacterTreeEffect as {
                parent?: CharacterTreeDecision;
            };

            if (!parent || !parent.type) {
                return;
            }

            let label = labels2[parent.type] ?? parent.type;

            if (label === 'Class') {
                label = parent.name;
            } else if (label === 'Subclass') {
                label = parent.parent!.name;
            }

            safeAssert(
                typeof label === 'string',
                `Label '${label}' must be a string`,
            );

            if (!m[label]) {
                m[label] = [];
            }

            m[label].push(c);
        });

        return m;
    }, [characteristics]);

    return (
        <StyledTabPanel {...panelProps}>
            {Object.entries(effectGroups)
                .sort(
                    (a, b) =>
                        Object.keys(labels).indexOf(a[0]) -
                        Object.keys(labels).indexOf(b[0]),
                )
                .map(([label, effects]) => (
                    <StyledTabPanelItem
                        key={label}
                        label={label}
                        component={Paper}
                        componentProps={{ elevation: 2 }}
                    >
                        <GrantedEffects effects={effects} flex />
                    </StyledTabPanelItem>
                ))}
        </StyledTabPanel>
    );
}
