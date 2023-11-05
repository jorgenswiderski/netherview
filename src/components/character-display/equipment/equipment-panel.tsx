// equipment-panel.tsx
import React, { useCallback, useMemo } from 'react';
import { Typography, Grid, Box, Paper } from '@mui/material';
import styled from '@emotion/styled';
import {
    EquipmentSlot,
    IEquipmentItem,
} from '@jorgenswiderski/tomekeeper-shared/dist/types/equipment-item';
import { EquipmentSlotCard } from './equipment-slot';
import { useCharacter } from '../../../context/character-context/character-context';
import { useResponsive } from '../../../hooks/use-responsive';

const StyledPaper = styled(Paper)`
    padding: 1rem;
    flex: 1;
`;

const MainContainer = styled(Box)`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    @media (max-width: 768px) {
        flex-direction: row;
        flex-wrap: wrap;
    }
`;

const TopContainer = styled(Box)`
    display: flex;
    justify-content: space-between;
    width: 100%;
`;

const Column = styled(Box)`
    display: flex;
    flex-direction: column;
`;

const BottomContainer = styled(Box)`
    display: flex;
    justify-content: space-between;
    width: 100%;
`;

const WeaponContainer = styled(Box)`
    display: flex;
`;

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
        return (
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
        );
    };

    return (
        <StyledPaper elevation={2}>
            <Typography variant="h6" align="left" gutterBottom>
                Equipped Items:
            </Typography>
            <MainContainer>
                {!isMobile && (
                    <>
                        <TopContainer>
                            <Column>
                                {equipmentSlots
                                    .slice(0, 4)
                                    .map(renderEquipmentSlot)}
                            </Column>
                            <Column>
                                {equipmentSlots
                                    .slice(4, 8)
                                    .map(renderEquipmentSlot)}
                            </Column>
                        </TopContainer>
                        <BottomContainer>
                            <WeaponContainer>
                                {equipmentSlots
                                    .slice(8, 10)
                                    .map(renderEquipmentSlot)}
                            </WeaponContainer>

                            <WeaponContainer>
                                {equipmentSlots
                                    .slice(10, 12)
                                    .map(renderEquipmentSlot)}
                            </WeaponContainer>
                        </BottomContainer>
                    </>
                )}
                {isMobile && (
                    <Grid container spacing={1}>
                        {equipmentSlots.map(renderEquipmentSlot)}
                    </Grid>
                )}
            </MainContainer>
        </StyledPaper>
    );
}
