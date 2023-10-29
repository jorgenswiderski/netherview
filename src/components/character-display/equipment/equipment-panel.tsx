// equipment-panel.tsx
import React, { useCallback, useMemo } from 'react';
import { Typography, Grid, Box } from '@mui/material';
import styled from '@emotion/styled';
import {
    EquipmentSlot,
    IEquipmentItem,
} from 'planner-types/src/types/equipment-item';
import { EquipmentSlotCard } from './equipment-slot';
import { useCharacter } from '../../../context/character-context/character-context';

const MainContainer = styled(Box)`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
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
`;

export function EquipmentPanel() {
    const { character, setCharacter } = useCharacter();

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

    return (
        <>
            <Typography variant="h6" align="left" gutterBottom>
                Equipped Items:
            </Typography>
            <MainContainer>
                <TopContainer>
                    <Column>
                        {equipmentSlots.slice(0, 4).map((slot) => (
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
                        ))}
                    </Column>
                    <Column>
                        {equipmentSlots.slice(4, 8).map((slot) => (
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
                        ))}
                    </Column>
                </TopContainer>
                <BottomContainer>
                    <WeaponContainer>
                        {equipmentSlots.slice(8, 10).map((slot) => (
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
                        ))}
                    </WeaponContainer>

                    <WeaponContainer>
                        {equipmentSlots.slice(10, 12).map((slot) => (
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
                        ))}
                    </WeaponContainer>
                </BottomContainer>
            </MainContainer>
        </>
    );
}
