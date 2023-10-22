// equipment-slot.tsx
import React, { useMemo, useState } from 'react';
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
} from '@mui/material';
import styled from '@emotion/styled';
import {
    EquipmentSlot,
    IEquipmentItem,
    ItemRarity,
} from 'planner-types/src/types/equipment-item';
import { BeatLoader } from 'react-spinners';
import { WeaveApi } from '../../../api/weave/weave';
import { error } from '../../../models/logger';
import { ItemDialogOption } from './item-dialog-option';
import { ItemTooltip } from './item-tooltip';
import { ItemColors } from '../../../models/items/types';

const StyledDialog = styled(Dialog)``;

const DialogBox = styled(Paper)`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    padding: 1rem;
`;

const StyledCard = styled(Card, {
    shouldForwardProp: (prop) =>
        prop !== 'color' && prop !== 'item' && prop !== 'disabled',
})<{ color?: string; item?: IEquipmentItem; disabled: boolean }>`
    width: 48px;
    height: 48px;
    position: relative;
    cursor: pointer;

    border: ${({ item }) => (item ? '1px solid' : 'none')};
    border-color: ${({ color }) => color};
    box-shadow: ${({ item, color }) => (item ? `0 0 2px ${color}` : 'none')};
    opacity: ${({ disabled }) => (disabled ? '0.6' : '1.0')};
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
}

export function EquipmentSlotCard({
    slot,
    onEquipItem,
    item,
    disabled = false,
}: EquipmentSlotCardProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [items, setItems] = useState<IEquipmentItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchInput, setSearchInput] = useState('');

    const handleClick = async () => {
        setIsOpen(true);
        setIsLoading(true);

        try {
            const data = await WeaveApi.getEquipmentItemInfo(slot);
            setItems(data);
        } catch (err) {
            error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredItems = useMemo(() => {
        // Filter items when searchInput changes
        const lowercasedInput = searchInput.toLowerCase();

        return items.filter(
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

    return (
        <>
            <ItemTooltip item={item}>
                <StyledCard
                    onClick={disabled ? () => {} : handleClick}
                    color={ItemColors[item?.rarity ?? ItemRarity.NONE]}
                    item={item}
                    disabled={disabled}
                >
                    {item && <ItemIcon image={item.image} component="img" />}
                    <CardContent />
                </StyledCard>
            </ItemTooltip>

            <StyledDialog
                fullWidth
                open={isOpen}
                onClose={() => setIsOpen(false)}
            >
                <DialogTitle>{EquipmentSlot[slot]} Options</DialogTitle>
                <DialogContent>
                    <DialogBox>
                        <TextField
                            variant="outlined"
                            label="Search"
                            fullWidth
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            margin="normal"
                        />
                        {isLoading && <BeatLoader />}
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
                    </DialogBox>
                </DialogContent>
            </StyledDialog>
        </>
    );
}
