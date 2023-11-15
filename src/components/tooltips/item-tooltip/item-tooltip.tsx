// item-tooltip.tsx
import React, { ReactElement, useMemo } from 'react';
import {
    EquipmentItemType,
    EquipmentSlot,
    IEquipmentItem,
    IWeaponItem,
    ItemRarity,
    WeaponHandedness,
    equipmentSlotTypes,
} from '@jorgenswiderski/tomekeeper-shared/dist/types/equipment-item';
import styled from '@emotion/styled';
import { darken, useTheme } from '@mui/system';
import { alpha } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import { ItemColors } from '../../../models/items/types';
import { Utils } from '../../../models/utils';
import { BaseTooltip } from '../base-tooltip';
import { DamageText } from '../../damage-text';
import { EquipmentArmorIcon } from '../../character-display/equipment/equipment-armor-icon';
import { ItemSourceText } from './item-source-text';

const GradientBox = styled(Box)<{ gradient: string }>`
    display: flex;
    flex-direction: column;
    align-items: stretch;

    background: ${(props) => props.gradient};
    margin: -0.5rem;
    padding: 0.5rem;
`;

const HeaderText = styled(Typography)`
    text-shadow:
        -1px -1px 0 #0004,
        1px -1px 0 #0004,
        -1px 1px 0 #0004,
        1px 1px 0 #0004;
`;

const StyledEquipmentArmorIcon = styled(EquipmentArmorIcon)`
    float: right;
`;

const EffectName = styled.span`
    color: rgb(255, 237, 157);
`;

const EffectDescription = styled.span``;

const QuoteText = styled(Typography)`
    font-style: italic;
`;

const WeaponPropertiesBox = styled(Box)`
    display: flex;
    flex-direction: row;
    gap: 0.75rem;
`;

const SourceBox = styled(Box)`
    display: flex;
    gap: 0.5rem;

    background: ${darken('#333', 0.3)};
    flex: 1;

    span {
        color: #777;
    }
`;

const WeightPriceBox = styled(Box)`
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;

    background: ${darken('#333', 0.3)};
`;

interface ItemTooltipProps {
    item?: IEquipmentItem;
    children: ReactElement;
}

export function ItemTooltip({ item, children }: ItemTooltipProps) {
    const theme = useTheme();

    const rarityColor = useMemo(
        () => (item?.rarity ? ItemColors[item?.rarity] : null),
        [item?.rarity],
    );

    const weapon = useMemo(() => {
        if (
            item?.type &&
            [
                ...equipmentSlotTypes[EquipmentSlot.MeleeMainhand],
                ...equipmentSlotTypes[EquipmentSlot.RangedMainhand],
            ].includes(item.type)
        ) {
            return item as IWeaponItem;
        }

        return undefined;
    }, [item]);

    if (!item) {
        return children;
    }

    if (!rarityColor) {
        return children;
    }

    const backgroundGradient = `linear-gradient(0deg, rgba(40,40,40,0.5), ${alpha(
        rarityColor,
        0.5,
    )} 90%)`;

    return (
        <BaseTooltip
            name={item.name}
            image={item.image}
            header={
                <GradientBox gradient={backgroundGradient}>
                    <HeaderText variant="h6" style={{ color: rarityColor }}>
                        {item.name}
                    </HeaderText>
                    <HeaderText color="rgb(138,99,69)">
                        {Utils.toProperCase(ItemRarity[item.rarity])}
                    </HeaderText>
                    {weapon && (
                        <DamageText
                            damages={[
                                [weapon.damage, weapon.damageType],
                                weapon.extraDamage,
                                weapon.extraDamage2,
                            ]}
                        />
                    )}
                </GradientBox>
            }
            body={
                <Box position="relative">
                    <StyledEquipmentArmorIcon item={item} />

                    {weapon?.enchantment && (
                        <Typography variant="body2">{`Weapon Enchantment +${weapon.enchantment}`}</Typography>
                    )}

                    {item.effects
                        .filter((effect) => !effect.hidden)
                        .map((effect) => (
                            <Typography
                                key={`${effect.name}${effect.description}`}
                                variant="body2"
                            >
                                {effect.name !== item.name && (
                                    <EffectName theme={theme}>
                                        {effect.name}:{' '}
                                    </EffectName>
                                )}
                                <EffectDescription theme={theme}>
                                    {effect.description}
                                </EffectDescription>
                            </Typography>
                        ))}
                </Box>
            }
            quote={
                <Box
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.25rem',
                    }}
                >
                    <QuoteText
                        variant="body2"
                        color="darkgray"
                    >{`"${item.quote}"`}</QuoteText>
                    {weapon && (
                        <WeaponPropertiesBox>
                            <Typography>
                                {EquipmentItemType[weapon.type]}
                            </Typography>
                            {['finesse', 'heavy', 'light', 'reach', 'thrown']
                                .map((key) => [key, (weapon as any)[key]])
                                .filter(([, show]) => show)
                                .map(([key]) => (
                                    <Typography>
                                        {Utils.toProperCase(key)}
                                    </Typography>
                                ))}
                            {weapon.handedness ===
                                WeaponHandedness.versatile && (
                                <Typography>Versatile</Typography>
                            )}
                            {weapon.handedness ===
                                WeaponHandedness['two-handed'] && (
                                <Typography>Two-Handed</Typography>
                            )}
                        </WeaponPropertiesBox>
                    )}
                </Box>
            }
            footer={
                <>
                    <SourceBox>
                        {item.sources && (
                            <ItemSourceText
                                sources={item.sources}
                                variant="body2"
                            />
                        )}
                    </SourceBox>
                    <WeightPriceBox>
                        {item.weightKg && (
                            <Typography>{item.weightKg}kg</Typography>
                        )}
                        {item.price && <Typography>{item.price}g</Typography>}
                    </WeightPriceBox>
                </>
            }
            touchBehavior="longPress"
        >
            {children}
        </BaseTooltip>
    );
}
