import React from 'react';
import { Box, BoxProps, Typography } from '@mui/material';
import ShieldIcon from '@mui/icons-material/Shield';
import styled from '@emotion/styled';
import { IEquipmentItem } from '@jorgenswiderski/tomekeeper-shared/dist/types/equipment-item';

const StyledBox = styled(Box)`
    display: flex;
    align-items: center;

    width: 36px;
    position: relative;
`;

const AcLabel = styled(Typography)`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`;

interface EquipmentArmorIconProps extends BoxProps {
    item: IEquipmentItem;
}

export function EquipmentArmorIcon({ item, ...rest }: EquipmentArmorIconProps) {
    if (!item.bonusArmorClass && !item.baseArmorClass) {
        return null;
    }

    return (
        <StyledBox {...rest}>
            <ShieldIcon fontSize="large" />
            <AcLabel variant="body2" color="black">
                {item.bonusArmorClass
                    ? `+${item.bonusArmorClass}`
                    : item.baseArmorClass}
            </AcLabel>
        </StyledBox>
    );
}
