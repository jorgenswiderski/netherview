// equipment-slot.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    CardContent,
    Card,
    Dialog,
    DialogTitle,
    DialogContent,
    Paper,
    CardMedia,
    TextField,
    CardMediaProps,
    Box,
} from '@mui/material';
import styled from '@emotion/styled';
import {
    EquipmentSlot,
    IEquipmentItem,
    ItemRarity,
} from '@jorgenswiderski/tomekeeper-shared/dist/types/equipment-item';
import { BeatLoader } from 'react-spinners';
import { WeaveApi } from '../../../api/weave/weave';
import { error } from '../../../models/logger';
import { ItemDialogOption } from './item-dialog-option';
import { ItemTooltip } from '../../tooltips/item-tooltip';
import { ItemColors } from '../../../models/items/types';
import { WeaveImages } from '../../../api/weave/weave-images';

const StyledDialog = styled(Dialog)`
    @media (max-width: 768px) {
        height: calc(100vh - 64px);
    }
`;

const StyledDialogTitle = styled(DialogTitle)`
    @media (max-width: 768px) {
        padding: 1rem;
    }
`;

const StyledDialogContent = styled(DialogContent)`
    @media (max-width: 768px) {
        padding: 0 0.75rem 0.75rem;
    }
`;

const DialogBox = styled(Paper)`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;

    padding: 1rem;
    overflow: hidden;

    @media (max-width: 768px) {
        padding: 0.75rem;
    }
`;

const ItemBox = styled(Box)`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    flex: 1;

    overflow: auto;
    min-height: 300px;
`;

const StyledCard = styled(Card, {
    shouldForwardProp: (prop) =>
        prop !== 'color' && prop !== 'item' && prop !== 'disabled',
})<{ color?: string; item?: IEquipmentItem; disabled: boolean }>`
    width: 48px;
    height: 48px;
    position: relative;
    cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};

    border: ${({ item, disabled }) =>
        item || disabled ? '1px solid' : 'none'};
    border-color: ${({ color, disabled }) => (disabled ? '#111' : color)};
    box-shadow: ${({ item, disabled, color }) =>
        item || disabled ? `0 0 2px ${color}` : 'none'};
    opacity: ${({ disabled }) => (disabled ? '0.6' : '1.0')};

    ${({ disabled }) =>
        disabled &&
        `
        &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(-45deg, transparent 49.5%, #444 49.5%, #444 50.5%, transparent 50.5%);
        }
    `}
`;

const ItemIcon = styled(CardMedia)<CardMediaProps>`
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
`;

interface EquipmentSlotCardProps {
    slot: EquipmentSlot;
    onEquipItem: (item: IEquipmentItem) => void;
    item?: IEquipmentItem;
    disabled?: boolean;
    filter?: (item: IEquipmentItem) => boolean;
}

export function EquipmentSlotCard({
    slot,
    onEquipItem,
    item,
    disabled = false,
    filter,
}: EquipmentSlotCardProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [items, setItems] = useState<IEquipmentItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchInput, setSearchInput] = useState('');

    const handleClick = async () => {
        setIsOpen(true);

        try {
            if (items.length === 0) {
                setIsLoading(true);
                const data = await WeaveApi.items.getEquipmentItemInfo(slot);
                setItems(data);
            }
        } catch (err) {
            error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredItems = useMemo(() => {
        // Remove unequippable items (eg 2handers in the offhand, etc)
        const prefilteredItems = filter ? items.filter(filter) : items;

        // Filter items when searchInput changes
        const lowercasedInput = searchInput.toLowerCase();

        return prefilteredItems.filter(
            (itemOption) =>
                itemOption?.name?.toLowerCase().includes(lowercasedInput) ||
                itemOption?.description
                    ?.toLowerCase()
                    .includes(lowercasedInput),
        );
    }, [searchInput, items]);

    const sortedItems = useMemo(() => {
        return filteredItems.sort((a, b) =>
            b.rarity === a.rarity
                ? (b.price ?? 0) - (a.price ?? 0)
                : b.rarity - a.rarity,
        );
    }, [filteredItems]);

    const imageContainerRef = useRef<HTMLDivElement>(null);
    const [path, setPath] = useState<string>();

    useEffect(() => {
        if (item?.image) {
            setPath(WeaveImages.getPath(item.image, imageContainerRef));
        }
    }, [item?.image, imageContainerRef]);

    return (
        <>
            <ItemTooltip item={item}>
                <StyledCard
                    onClick={disabled ? () => {} : handleClick}
                    color={ItemColors[item?.rarity ?? ItemRarity.NONE]}
                    item={item}
                    disabled={disabled}
                    ref={imageContainerRef}
                >
                    {path && <ItemIcon image={path} component="img" />}
                    <CardContent />
                </StyledCard>
            </ItemTooltip>

            <StyledDialog
                fullWidth
                open={isOpen}
                onClose={() => setIsOpen(false)}
            >
                <StyledDialogTitle>
                    {EquipmentSlot[slot]} Options
                </StyledDialogTitle>
                <StyledDialogContent
                    sx={{
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1,
                    }}
                >
                    <DialogBox>
                        <TextField
                            variant="outlined"
                            label="Search"
                            fullWidth
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            margin="normal"
                        />
                        <ItemBox>
                            {isLoading && (
                                <Box textAlign="center">
                                    <BeatLoader />
                                </Box>
                            )}
                            {sortedItems.map((itemOption) => (
                                <ItemDialogOption
                                    item={itemOption}
                                    elevation={3}
                                    onClick={() => {
                                        onEquipItem(itemOption);
                                        setIsOpen(false);
                                    }}
                                />
                            ))}
                        </ItemBox>
                    </DialogBox>
                </StyledDialogContent>
            </StyledDialog>
        </>
    );
}
