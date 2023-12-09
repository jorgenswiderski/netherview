import React, { useMemo } from 'react';
import styled from '@emotion/styled';
import { CharacterPlannerStep } from '@jorgenswiderski/tomekeeper-shared/dist/types/character-feature-customization-option';
import { Paper } from '@mui/material';
import { IPassive } from '@jorgenswiderski/tomekeeper-shared/dist/types/grantable-effect';
import { TabPanel } from '../../../simple-tabs/tab-panel';
import { TabPanelProps } from '../../../simple-tabs/types';
import { useCharacter } from '../../../../context/character-context/character-context';
import { GrantedEffects } from '../../../character-planner/feature-picker/prospective-effects/granted-effects';
import { CharacterTreeDecision } from '../../../../models/character/character-tree-node/character-tree';
import { TabPanelItem } from '../../../simple-tabs/tab-panel-item';
import { safeAssert } from '../../../../models/utils';
import { Character } from '../../../../models/character/character';
import { ICharacterTreeDecision } from '../../../../models/character/character-tree-node/types';
import { CharacterTreePassive } from '../../../../models/character/character-tree-node/character-tree-passive';

const StyledTabPanel = styled(TabPanel)``;
const StyledTabPanelItem = styled(TabPanelItem)``;

const labels: Record<string, CharacterPlannerStep[]> = {
    Class: [
        CharacterPlannerStep.PRIMARY_CLASS,
        CharacterPlannerStep.SECONDARY_CLASS,
        CharacterPlannerStep.LEVEL_UP,
        CharacterPlannerStep.CLASS_FEATURE,
        CharacterPlannerStep.CLASS_FEATURE_SUBCHOICE,
        CharacterPlannerStep.CHOOSE_SUBCLASS,
        CharacterPlannerStep.SUBCLASS_FEATURE,
        CharacterPlannerStep.WARLOCK_PACT_BOON,
        CharacterPlannerStep.WARLOCK_DEEPENED_PACT,
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

interface PassivesTabProps extends TabPanelProps {}

export function PassivesTab({ ...panelProps }: PassivesTabProps) {
    const { character } = useCharacter();

    const passives = useMemo(() => character.getPassives(), [character]);

    const getClassParent = (
        node: ICharacterTreeDecision,
    ): ICharacterTreeDecision => {
        if (node.type && Character.LEVEL_STEPS.includes(node.type)) {
            return node;
        }

        return getClassParent(node.parent as ICharacterTreeDecision);
    };

    const effectGroups = useMemo(() => {
        const groups: Record<string | number, IPassive[]> = {};

        passives.forEach((passive) => {
            if (passive.hidden) {
                return;
            }

            const { parent } = passive as CharacterTreePassive as {
                parent?: CharacterTreeDecision;
            };

            if (!parent || !parent.type) {
                return;
            }

            let label = labels2[parent.type] ?? parent.type;

            if (label === 'Class') {
                // Find the nearest class parent node
                const classParent = getClassParent(parent);
                label = classParent.name;
            }

            safeAssert(
                typeof label === 'string',
                `Passives tab section label '${label}' must be a string`,
            );

            if (!groups[label]) {
                groups[label] = [];
            }

            groups[label].push(passive);
        });

        return groups;
    }, [passives]);

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
