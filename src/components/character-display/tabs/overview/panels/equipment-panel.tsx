// equipment-panel.tsx
import React, { useMemo } from 'react';
import { Paper } from '@mui/material';
import styled from '@emotion/styled';
import { TabPanelItem } from '../../../../simple-tabs/tab-panel-item';
import { EquipmentSlots } from '../../../equipment/equipment-slots';
import { useCharacter } from '../../../../../context/character-context/character-context';

const StyledTabPanelItem = styled(TabPanelItem)``;

export function EquipmentPanel() {
    const { character } = useCharacter();

    const hasAnyEquippedItems = useMemo(() => {
        const items = character.getEquipment();

        return Object.keys(items).length > 0;
    }, [character]);

    if (!hasAnyEquippedItems) {
        return null;
    }

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
