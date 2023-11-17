// equipment-slots.tsx
import React, { useCallback, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import styled from '@emotion/styled';
import {
    EquipmentSlot,
    IEquipmentItem,
    equipmentSlotLabels,
} from '@jorgenswiderski/tomekeeper-shared/dist/types/equipment-item';
import { ItemSource } from '@jorgenswiderski/tomekeeper-shared/dist/types/item-sources';
import { useResponsive } from '../../../hooks/use-responsive';
import { useCharacter } from '../../../context/character-context/character-context';
import { EquipmentSlotCard } from './equipment-slot-card';
import { CharacterEquipment, ItemColors } from '../../../models/items/types';
import { ItemSourceText } from '../../tooltips/item-tooltip/item-source-text';

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

const EquipmentSlotTextBox = styled(Box)`
    display: flex;
    flex-direction: column;
    align-items: stretch;

    flex: 1;

    overflow: hidden;
`;

const EquipmentSlotTypography = styled(Typography)<{ mirrored: boolean }>`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: ${({ mirrored }) => (mirrored ? 'right' : 'left')};
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
            <EquipmentSlotTextBox
                color={ItemColors[items[slot]?.item.rarity] ?? '#555'}
            >
                <EquipmentSlotTypography mirrored={!isMobile && index < 6}>
                    {items[slot]?.item.name
                        ? items[slot]?.item.name
                        : equipmentSlotLabels[slot]}
                </EquipmentSlotTypography>
                {items[slot]?.item.sources && (
                    <ItemSourceText
                        overflow="hidden"
                        textOverflow="ellipsis"
                        whiteSpace="nowrap"
                        align={!isMobile && index < 6 ? 'right' : 'left'}
                        variant="body2"
                        color="gray"
                        sources={items[slot].item.sources as ItemSource[]}
                    />
                )}
            </EquipmentSlotTextBox>
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

interface EquipmentSlotsProps {
    compact?: boolean;
}

export function EquipmentSlots({ compact }: EquipmentSlotsProps) {
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
