import React from 'react';
import styled from '@emotion/styled';
import { TabPanel } from '../../../simple-tabs/tab-panel';
import { TabPanelProps } from '../../../simple-tabs/types';
import { EquipmentSlots } from '../../equipment/equipment-slots';

const StyledTabPanel = styled(TabPanel)`
    column-gap: 0;
`;

interface EquipmentTabProps extends TabPanelProps {}

export function EquipmentTab({ ...panelProps }: EquipmentTabProps) {
    return (
        <StyledTabPanel {...panelProps}>
            <EquipmentSlots />
        </StyledTabPanel>
    );
}
