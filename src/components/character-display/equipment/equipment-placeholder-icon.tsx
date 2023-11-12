import React from 'react';
import styled from '@emotion/styled';
import { EquipmentSlot } from '@jorgenswiderski/tomekeeper-shared/dist/types/equipment-item';

const iconRes = 51.2;

const Icon = styled.div<{ position: string }>`
    width: ${iconRes}px;
    height: ${iconRes}px;
    background-image: url('/equipment-slots.png');
    background-position: ${({ position }) => position};
    background-repeat: no-repeat;
    background-size: ${256 * (48 / iconRes)}px ${256 * (48 / iconRes)}px;
    filter: grayscale(100%) opacity(20%);
    background-blend-mode: difference;
    background-color: rgb(0, 13, 22);
`;

export function EquipmentPlaceholderIcon({
    slotType,
}: {
    slotType: EquipmentSlot;
}) {
    const iconPositions: Record<EquipmentSlot, string> = {
        [EquipmentSlot.Head]: '-4px -10px',
        [EquipmentSlot.Body]: '-189px -123px',
        [EquipmentSlot.Hands]: '-96px -10px',
        [EquipmentSlot.Feet]: '-143px -124px',
        [EquipmentSlot.Back]: '-4px -124px',
        [EquipmentSlot.Amulet]: '-50px -12px',
        [EquipmentSlot.Ring1]: '-143px -67px',
        [EquipmentSlot.Ring2]: '-143px -67px',
        [EquipmentSlot.MeleeMainhand]: '-4px -180px',
        [EquipmentSlot.MeleeOffhand]: '-189px -67px',
        [EquipmentSlot.RangedMainhand]: '-96px -180px',
        [EquipmentSlot.RangedOffhand]: '-96px -180px',
    };

    return <Icon position={iconPositions[slotType]} />;
}
