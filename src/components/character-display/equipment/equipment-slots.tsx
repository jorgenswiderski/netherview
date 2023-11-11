// equipment-slots.tsx
import React, { useCallback, useMemo, useState } from 'react';
import { Box, Typography } from '@mui/material';
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
    return (
        <Box
            sx={{ width: 'calc(300px + 2.5rem)' }}
            display="flex"
            flexWrap="wrap"
            gap="0.5rem"
            justifyContent="center"
        >
            {slots.map((slot) => (
                <EquipmentSlotCard
                    key={slot}
                    slot={slot}
                    onEquipItem={(item: IEquipmentItem) =>
                        onEquipItem(slot, item)
                    }
                    item={items[slot]?.item}
                    disabled={disabledSlots[slot]}
                    filter={slotFilters[slot]}
                />
            ))}
        </Box>
    );
}

const EquipmentSlotBox = styled(Box)<{
    color: string;
    mirrored: boolean;
}>`
    display: flex;
    flex-direction: ${({ mirrored }) => (mirrored ? 'row-reverse' : 'row')};
    gap: 1rem;

    position: relative;
    padding: 1rem;
    background: linear-gradient(
        ${({ mirrored }) => (mirrored ? '-10deg' : '10deg')},
        ${({ color }) => alpha(color, 0.2)},
        #0000 50%
    );

    ::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        height: 1px;
        width: 100%;
        background: linear-gradient(
            ${({ mirrored }) => (mirrored ? 'to left' : 'to right')},
            ${({ color }) => color},
            #0000
        );
    }
`;

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
        <EquipmentSlotBox
            key={slot}
            color={ItemColors[items[slot]?.item.rarity] ?? '#0000'}
            mirrored={!isMobile && index < 6}
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
        </EquipmentSlotBox>
    ));
}

const MainContainer = styled(Box)<{ compact?: boolean }>`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: ${({ compact }) => (compact ? 'center' : 'stretch')};
    gap: ${({ compact }) => (compact ? '0.5rem' : '0')};

    position: relative;

    @media (max-width: 768px) {
        flex-direction: ${({ compact }) => (compact ? 'row' : 'column')};
        flex-wrap: wrap;
    }
`;

const EmptyStateOverlay = styled(Box)`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    // background-color: rgba(
    //     255,
    //     255,
    //     255,
    //     0.1
    // ); // Adjust the color and opacity to your liking
    backdrop-filter: blur(10px);
    z-index: 10;
    cursor: pointer;
`;

interface EquipmentSlotsProps {
    compact?: boolean;
}

export function EquipmentSlots({ compact }: EquipmentSlotsProps) {
    const { character, setCharacter } = useCharacter();

    const [dismissedOverlay, setDismissedOverlay] = useState(false);

    const equipmentSlots = Object.keys(EquipmentSlot)
        .filter((key) => !Number.isNaN(Number(EquipmentSlot[key as any])))
        .map((key) => EquipmentSlot[key as keyof typeof EquipmentSlot]);

    const items = useMemo(() => character.getEquipment(), [character]);
    const hasItems = equipmentSlots.some((slot) => items[slot]?.item);

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
            {!hasItems && !dismissedOverlay && (
                <EmptyStateOverlay onClick={() => setDismissedOverlay(true)}>
                    <Typography variant="body1">
                        No equipment yet, click here to add some!
                    </Typography>
                </EmptyStateOverlay>
            )}

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
