// equipment-panel.tsx
import React from 'react';
import { Paper } from '@mui/material';
import styled from '@emotion/styled';
import { TabPanelItem } from '../../../../simple-tabs/tab-panel-item';
import { EquipmentSlots } from '../../../equipment/equipment-slots';

const StyledTabPanelItem = styled(TabPanelItem)``;

export function EquipmentPanel() {
    return (
        <StyledTabPanelItem
            label="Equipment"
            component={Paper}
            componentProps={{ elevation: 2 }}
        >
            <EquipmentSlots compact />
        </StyledTabPanelItem>
    );
}
