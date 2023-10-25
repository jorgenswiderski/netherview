import React, { ReactElement, useMemo } from 'react';
import {
    DamageType,
    EquipmentItemType,
    EquipmentSlot,
    IEquipmentItem,
    IWeaponItem,
    ItemRarity,
    WeaponHandedness,
    equipmentSlotTypes,
} from 'planner-types/src/types/equipment-item';
import styled from '@emotion/styled';
import { darken, useTheme } from '@mui/system';
import { alpha } from '@mui/material/styles';
import { Box, Typography, Tooltip } from '@mui/material';
import { ItemColors } from '../../../models/items/types';
import { Utils } from '../../../models/utils';

const MainBox = styled(Box)`
    position: relative;
`;

const HeaderSection = styled(Box)<{ gradient: string }>`
    display: flex;
    flex-direction: column;
    align-items: stretch;

    background: ${(props) => props.gradient};
    padding: 0.5rem;
`;

const EffectBox = styled(Box)`
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    padding: 0.5rem;
`;

const EffectName = styled.span`
    color: rgb(255, 237, 157);
`;

const EffectDescription = styled.span``;

const QuoteBox = styled(Box)`
    background: ${darken('#333', 0.1)};
    opacity: 0.6;
    padding: 0.5rem;

    display: flex;
    flex-direction: column;
    gap: 0.25rem;
`;

const QuoteText = styled(Typography)`
    font-style: italic;
`;

const WeaponPropertiesBox = styled(Box)`
    display: flex;
    flex-direction: row;
    gap: 0.75rem;
`;

const WeightPriceBox = styled(Box)`
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;

    background: ${darken('#333', 0.3)};
    padding: 0.5rem;
`;

const Icon = styled('img')`
    position: absolute;
    top: -5%;
    right: -5%;
    opacity: 0.7;
    width: 120px;
    height: 120px;
`;

interface ItemTooltipProps {
    item?: IEquipmentItem;
    children: ReactElement<any, any>;
}

export function ItemTooltip({ item, children }: ItemTooltipProps) {
    const theme = useTheme();

    if (!item) {
        return children;
    }

    const rarityColor = useMemo(() => ItemColors[item.rarity], [item.rarity]);

    if (!rarityColor) {
        return children;
    }

    const weapon = useMemo(() => {
        if (
            [
                ...equipmentSlotTypes[EquipmentSlot.MeleeMainhand],
                ...equipmentSlotTypes[EquipmentSlot.RangedMainhand],
            ].includes(item.type)
        ) {
            return item as IWeaponItem;
        }

        return undefined;
    }, [item]);

    const backgroundGradient = `linear-gradient(0deg, rgba(40,40,40,0.5), ${alpha(
        rarityColor,
        0.5,
    )} 90%)`;

    return (
        <Tooltip
            PopperProps={{
                style: { pointerEvents: 'none' },
                modifiers: [
                    {
                        name: 'flip',
                        options: {
                            fallbackPlacements: [
                                'top',
                                'right',
                                'bottom',
                                'left',
                            ],
                        },
                    },
                    {
                        name: 'preventOverflow',
                        options: {
                            altAxis: true,
                            tether: true,
                            tetherOffset: () => 20,
                            boundary: 'viewport',
                        },
                    },
                ],
            }}
            title={
                <MainBox>
                    {/* First Section: Name and Rarity */}
                    <HeaderSection gradient={backgroundGradient}>
                        <Typography variant="h6" style={{ color: rarityColor }}>
                            {item.name}
                        </Typography>
                        <Typography color="rgb(138,99,69)">
                            {Utils.toProperCase(ItemRarity[item.rarity])}
                        </Typography>
                        {weapon && (
                            <>
                                <Typography>
                                    {weapon.damage}{' '}
                                    {DamageType[weapon.damageType]}
                                </Typography>
                                {weapon.extraDamage && (
                                    <Typography>
                                        {'+ '}
                                        {weapon.extraDamage}
                                    </Typography>
                                )}
                                {weapon.extraDamage2 && (
                                    <Typography>
                                        {'+ '}
                                        {weapon.extraDamage2}
                                    </Typography>
                                )}
                            </>
                        )}
                    </HeaderSection>

                    {/* Second Section: Effects */}
                    <EffectBox>
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
                    </EffectBox>

                    {/* Third Section: Quote */}
                    <QuoteBox>
                        <QuoteText
                            variant="body2"
                            color="darkgray"
                        >{`"${item.quote}"`}</QuoteText>
                        {weapon && (
                            <WeaponPropertiesBox>
                                <Typography>
                                    {EquipmentItemType[weapon.type]}
                                </Typography>
                                {[
                                    'finesse',
                                    'heavy',
                                    'light',
                                    'reach',
                                    'thrown',
                                ]
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
                            </WeaponPropertiesBox>
                        )}
                    </QuoteBox>

                    {/* Fourth Section: Weight and Price */}
                    <WeightPriceBox>
                        {item.weightKg && (
                            <Typography>{item.weightKg}kg</Typography>
                        )}
                        {item.price && <Typography>{item.price}g</Typography>}
                    </WeightPriceBox>

                    {/* Icon */}
                    <Icon src={item.image} alt={item.name} />
                </MainBox>
            }
        >
            {children}
        </Tooltip>
    );
}
