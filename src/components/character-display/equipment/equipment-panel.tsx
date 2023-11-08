// equipment-panel.tsx
import React, { useCallback, useMemo } from 'react';
import { Grid, Box, Paper } from '@mui/material';
import styled from '@emotion/styled';
import {
    EquipmentSlot,
    IEquipmentItem,
} from '@jorgenswiderski/tomekeeper-shared/dist/types/equipment-item';
import { EquipmentSlotCard } from './equipment-slot';
import { useCharacter } from '../../../context/character-context/character-context';
import { useResponsive } from '../../../hooks/use-responsive';
import { TabPanelItem } from '../../simple-tabs/tab-panel-item';

const StyledTabPanelItem = styled(TabPanelItem)``;

const MainContainer = styled(Box)`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;

    @media (max-width: 768px) {
        flex-direction: row;
        flex-wrap: wrap;
    }
`;

// const TopContainer = styled(Box)`
//     display: flex;
//     justify-content: space-between;
//     width: 100%;
// `;

// const Column = styled(Box)`
//     display: flex;
//     flex-direction: column;
// `;

// const BottomContainer = styled(Box)`
//     display: flex;
//     justify-content: space-between;
//     width: 100%;
// `;

// const WeaponContainer = styled(Box)`
//     display: flex;
// `;

const StyledGrid = styled(Grid)`
    margin: 8px;

    @media (max-width: 768px) {
        margin: 0;
    }
`;

export function EquipmentPanel() {
    const { character, setCharacter } = useCharacter();
    const { isMobile } = useResponsive();

    const items = useMemo(() => character.getEquipment(), [character]);

    const onEquipItem = useCallback(
        (slot: EquipmentSlot, item: IEquipmentItem) => {
            const newCharacter = character.equipItem(slot, item);
            setCharacter(newCharacter);
        },
        [character],
    );

    const equipmentSlots = Object.keys(EquipmentSlot)
        .filter((key) => !Number.isNaN(Number(EquipmentSlot[key as any])))
        .map((key) => EquipmentSlot[key as keyof typeof EquipmentSlot]);

    const slotFilters = useMemo(
        () => character.getEquipmentSlotFilters(),
        [character],
    );

    const disabledSlots = useMemo(
        () => character.getEquipmentSlotDisableStatus(),
        [character],
    );

    const renderEquipmentSlot = (slot: EquipmentSlot) => {
        return isMobile ? (
            <StyledGrid item key={slot}>
                <EquipmentSlotCard
                    slot={slot}
                    onEquipItem={(item: IEquipmentItem) =>
                        onEquipItem(slot, item)
                    }
                    item={items[slot]?.item}
                    disabled={disabledSlots[slot]}
                    filter={slotFilters[slot]}
                />
            </StyledGrid>
        ) : (
            <EquipmentSlotCard
                slot={slot}
                onEquipItem={(item: IEquipmentItem) => onEquipItem(slot, item)}
                item={items[slot]?.item}
                disabled={disabledSlots[slot]}
                filter={slotFilters[slot]}
            />
        );
    };

    return (
        <StyledTabPanelItem
            label="Equipment"
            component={Paper}
            componentProps={{ elevation: 2 }}
        >
            <MainContainer>
                {isMobile && (
                    <Grid container spacing={1}>
                        {equipmentSlots.map(renderEquipmentSlot)}
                    </Grid>
                )}
                {!isMobile &&
                    [
                        equipmentSlots.slice(0, 6),
                        equipmentSlots.slice(6, 12),
                    ].map((row) => (
                        <Box sx={{ display: 'flex', gap: '0.5rem' }}>
                            {row.map(renderEquipmentSlot)}
                        </Box>
                    ))}
            </MainContainer>
        </StyledTabPanelItem>
    );
}
