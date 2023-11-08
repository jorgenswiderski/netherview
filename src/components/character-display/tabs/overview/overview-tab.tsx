import React from 'react';
import { AbilityScoresPanel } from './panels/ability-scores-panel';
import { CharacterBackgroundPanel } from './panels/character-background-panel';
import { FeatsPanel } from './panels/feats-panel';
import { ActionsPanel } from './panels/actions-panel';
import { TabPanel } from '../../../simple-tabs/tab-panel';
import { TabPanelProps } from '../../../simple-tabs/types';
import { EquipmentPanel } from '../../equipment/equipment-panel';

interface OverviewTabProps extends TabPanelProps {}

export function OverviewTab({ ...panelProps }: OverviewTabProps) {
    return (
        <TabPanel {...panelProps}>
            <AbilityScoresPanel />
            <CharacterBackgroundPanel />
            <EquipmentPanel />
            <FeatsPanel />
            <ActionsPanel />
        </TabPanel>
    );
}
