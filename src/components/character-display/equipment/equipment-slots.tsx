// equipment-slots.tsx
import React, { useCallback, useMemo } from 'react';
import { Grid, Box, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import styled from '@emotion/styled';
import {
    EquipmentSlot,
    IEquipmentItem,
} from '@jorgenswiderski/tomekeeper-shared/dist/types/equipment-item';
import { useResponsive } from '../../../hooks/use-responsive';
import { useCharacter } from '../../../context/character-context/character-context';
import { EquipmentSlotCard } from './equipment-slot-card';
import { CharacterEquipment, ItemColors } from '../../../models/items/types';

const MainContainer = styled(Box)<{ compact: boolean }>`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: ${({ compact }) => (compact ? 'center' : 'stretch')};
    gap: ${({ compact }) => (compact ? '0.5rem' : '0')};

    @media (max-width: 768px) {
        flex-direction: row;
        flex-wrap: wrap;
    }
`;

const StyledGrid = styled(Grid)`
    margin: 8px;

    @media (max-width: 768px) {
        margin: 0;
    }
`;

interface SlotsCompactProps {
    slots: EquipmentSlot[];
    items: CharacterEquipment;
    onEquipItem: (slot: EquipmentSlot, item: IEquipmentItem) => void;
    slotFilters: Record<number, (item: IEquipmentItem) => boolean>;
    disabledSlots: Record<number, boolean>;
}

function SlotsCompact({
    slots,
    items,
    onEquipItem,
    slotFilters,
    disabledSlots,
}: SlotsCompactProps) {
    const { isMobile } = useResponsive();

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
                key={slot}
                slot={slot}
                onEquipItem={(item: IEquipmentItem) => onEquipItem(slot, item)}
                item={items[slot]?.item}
                disabled={disabledSlots[slot]}
                filter={slotFilters[slot]}
            />
        );
    };

    return (
        <>
            {isMobile && (
                <Grid container spacing={1}>
                    {slots.map(renderEquipmentSlot)}
                </Grid>
            )}
            {!isMobile &&
                [slots.slice(0, 6), slots.slice(6, 12)].map((row, index) => (
                    <Box
                        // eslint-disable-next-line react/no-array-index-key
                        key={index}
                        sx={{ display: 'flex', gap: '0.5rem' }}
                    >
                        {row.map(renderEquipmentSlot)}
                    </Box>
                ))}
        </>
    );
}

interface SlotsProps extends SlotsCompactProps {}

function Slots({
    slots,
    items,
    onEquipItem,
    slotFilters,
    disabledSlots,
}: SlotsProps) {
    const { isMobile } = useResponsive();

    return slots.map((slot, index) => (
        <Box
            key={slot}
            display="flex"
            flexDirection={!isMobile && index < 6 ? 'row-reverse' : 'row'}
            gap="1rem"
            sx={{
                background: `linear-gradient(${
                    index < 6 ? '-10deg' : '10deg'
                }, ${alpha(
                    ItemColors[items[slot]?.item.rarity] ?? '#0000',
                    0.2,
                )}, #0000 50%)`,
            }}
            padding="1rem"
        >
            <EquipmentSlotCard
                slot={slot}
                onEquipItem={(item: IEquipmentItem) => onEquipItem(slot, item)}
                item={items[slot]?.item}
                disabled={disabledSlots[slot]}
                filter={slotFilters[slot]}
            />

            <Box display="flex" flexDirection="column" flex={1}>
                <Typography align={!isMobile && index < 6 ? 'right' : 'left'}>
                    {items[slot]?.item.name}
                </Typography>
            </Box>
        </Box>
    ));
}

interface EquipmentSlotsProps {
    compact?: boolean;
}

export function EquipmentSlots({ compact = false }: EquipmentSlotsProps) {
    const { character, setCharacter } = useCharacter();

    const equipmentSlots = Object.keys(EquipmentSlot)
        .filter((key) => !Number.isNaN(Number(EquipmentSlot[key as any])))
        .map((key) => EquipmentSlot[key as keyof typeof EquipmentSlot]);

    const items = useMemo(() => character.getEquipment(), [character]);

    const onEquipItem = useCallback(
        (slot: EquipmentSlot, item: IEquipmentItem) => {
            const newCharacter = character.equipItem(slot, item);
            setCharacter(newCharacter);
        },
        [character],
    );

    const slotFilters = useMemo(
        () => character.getEquipmentSlotFilters(),
        [character],
    );

    const disabledSlots = useMemo(
        () => character.getEquipmentSlotDisableStatus(),
        [character],
    );

    return (
        <MainContainer compact={compact}>
            {compact ? (
                <SlotsCompact
                    slots={equipmentSlots}
                    items={items}
                    onEquipItem={onEquipItem}
                    slotFilters={slotFilters}
                    disabledSlots={disabledSlots}
                />
            ) : (
                <Slots
                    slots={equipmentSlots}
                    items={items}
                    onEquipItem={onEquipItem}
                    slotFilters={slotFilters}
                    disabledSlots={disabledSlots}
                />
            )}
        </MainContainer>
    );
}
