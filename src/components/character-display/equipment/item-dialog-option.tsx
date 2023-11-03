// item-dialog-option.tsx
import React from 'react';
import styled from '@emotion/styled';
import {
    Box,
    Card,
    CardContent,
    CardMedia,
    CardMediaProps,
    CardProps,
    Typography,
} from '@mui/material';
import { IEquipmentItem } from '@jorgenswiderski/tomekeeper-shared/dist/types/equipment-item';
import ShieldIcon from '@mui/icons-material/Shield';
import LazyLoad from 'react-lazyload';
import { ItemTooltip } from '../../tooltips/item-tooltip';
import { ItemColors } from '../../../models/items/types';
import { WeaveImages } from '../../../api/weave/weave-images';

const ItemContainer = styled(Card)`
    display: flex;
    align-items: center;
    gap: 0.2rem;
    padding: 0.5rem;
`;

const ItemDetails = styled(CardContent)`
    display: flex;
    flex-direction: column;
`;

const Subheader = styled(Box)`
    display: flex;
    gap: 1rem;
`;

const CardIcon = styled(CardMedia)<
    CardMediaProps & {
        color: string;
    }
>`
    width: 80px;
    height: 80px;
    border: 2px solid;
    border-color: ${(props) => props.color};
    box-shadow: 0 0 6px ${(props) => props.color};

    @media (max-width: 768px) {
        width: 60px;
        height: 60px;
    }
`;

const AcLabel = styled(Typography)`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`;

const ItemLabel = styled(Typography)`
    @media (max-width: 768px) {
        font-size: 1rem;
    }
`;

const HeaderBox = styled(Box)`
    display: flex;
    align-items: center;
    gap: 0.5rem;
`;

interface ItemDialogOptionProps extends CardProps {
    item: IEquipmentItem;
    onClick: () => void;
}

export function ItemDialogOption({ item, ...props }: ItemDialogOptionProps) {
    const color = ItemColors[item.rarity];

    return (
        <ItemTooltip item={item}>
            <ItemContainer {...props}>
                <LazyLoad height={80} offset={600} once overflow>
                    <CardIcon
                        component="img"
                        src={WeaveImages.getPath(item.image, 80)}
                        color={color}
                    />
                </LazyLoad>
                <ItemDetails>
                    <HeaderBox>
                        {(item.baseArmorClass || item.bonusArmorClass) && (
                            <Box
                                position="relative"
                                display="flex"
                                alignItems="center"
                            >
                                <ShieldIcon fontSize="large" />
                                <AcLabel variant="body2" color="black">
                                    {item.baseArmorClass ??
                                        `+${item.bonusArmorClass}`}
                                </AcLabel>
                            </Box>
                        )}
                        <ItemLabel variant="h6" color={color}>
                            {item.name}
                        </ItemLabel>
                    </HeaderBox>
                    <Subheader />
                </ItemDetails>
            </ItemContainer>
        </ItemTooltip>
    );
}
