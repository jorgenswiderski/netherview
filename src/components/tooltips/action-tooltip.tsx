// action-tooltip.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import {
    ActionRangeType,
    ActionSchool,
    ActionResource,
    IActionBase,
} from '@jorgenswiderski/tomekeeper-shared/dist/types/action';
import styled from '@emotion/styled';
import { AbilityScore } from '@jorgenswiderski/tomekeeper-shared/dist/types/ability';
import { BaseTooltip } from './base-tooltip';
import { Utils } from '../../models/utils';
import { DamageText } from '../damage-text';
import { WeaveImages } from '../../api/weave/weave-images';

const ConditionBox = styled(Box)`
    display: flex;
    align-items: center;
    gap: 0.5rem;

    margin: 0 0.5rem;
`;

const ConditionIcon = styled.img`
    width: 32px;
    height: 32px;
`;

const ActionDetailsBox = styled(Box)`
    display: flex;
    gap: 1rem;
`;

const ActionDetails: Record<
    string,
    (key: string, value: any) => string | null
> = {
    aoeM: (key, value) => `Radius: ${value}m`, // FIXME: not always a circle, depends on "aoe" property
    range: (key, value) => {
        if (value === ActionRangeType.ranged) {
            return `Range: 18m`;
        }

        if (value === ActionRangeType.melee) {
            return 'Range: Melee';
        }

        return 'Range: Self';
    },
    conditionSave: (key, value) =>
        `${AbilityScore[value].slice(0, 3).toUpperCase()} Save`,
    concentration: (key, value) => (value ? 'Concentration' : null),
};

function renderActionDetails(action: IActionBase) {
    const details = Object.entries(ActionDetails)
        .filter(
            ([key]) => typeof action[key as keyof IActionBase] !== 'undefined',
        )
        .map(([key, formatter]) => [
            key,
            formatter(key, action[key as keyof IActionBase]),
        ])
        .filter(([, string]) => string)
        .map(([key, string]) => (
            <Typography key={key} variant="body2">
                {string}
            </Typography>
        ));

    if (details.length === 0) {
        return null;
    }

    return <ActionDetailsBox>{details}</ActionDetailsBox>;
}

interface ActionTooltipProps {
    action?: IActionBase;
    children: React.ReactElement;
}

export function ActionTooltip({ action, children }: ActionTooltipProps) {
    if (!action) {
        return children;
    }

    function getSubheaderText() {
        if (
            action!.school === ActionSchool['Class Action'] ||
            action!.school === ActionSchool.NONE
        ) {
            return 'Class Action';
        }

        return action!.level > 0
            ? `Level ${action!.level} ${ActionSchool[action!.school]} Spell`
            : `${ActionSchool[action!.school]} Cantrip`;
    }

    function renderConditionOrArea(
        name: string,
        image: string,
        duration: number = 0,
    ) {
        return (
            <ConditionBox>
                <ConditionIcon
                    src={WeaveImages.getPath(image, 32)}
                    alt={name}
                />
                <Typography variant="body2">
                    {duration > 0
                        ? `${name}: ${duration} turn${duration > 1 ? 's' : ''}`
                        : `Until Long Rest`}
                </Typography>
            </ConditionBox>
        );
    }

    return (
        <BaseTooltip
            name={action.name}
            image={action.image}
            header={
                <>
                    <Typography variant="h6">{action.name}</Typography>
                    <Typography variant="subtitle2" color="textSecondary">
                        {getSubheaderText()}
                    </Typography>
                </>
            }
            quote={
                <>
                    {action.damageType && (
                        <DamageText
                            damages={[
                                [action.damage, action.damageType],
                                [
                                    action.extraDamage,
                                    action.extraDamageType ?? action.damageType,
                                ],
                            ]}
                        />
                    )}

                    {action.areaTurnStartDamage &&
                        action.areaTurnStartDamageType && (
                            <DamageText
                                damages={[
                                    [
                                        action.areaTurnStartDamage,
                                        action.areaTurnStartDamageType,
                                    ],
                                ]}
                            />
                        )}

                    {action.areaTurnEndDamage &&
                        action.areaTurnEndDamageType && (
                            <DamageText
                                damages={[
                                    [
                                        action.areaTurnEndDamage,
                                        action.areaTurnEndDamageType,
                                    ],
                                ]}
                            />
                        )}

                    <Typography variant="body2">
                        {action.description}
                    </Typography>

                    {action.areaName &&
                        renderConditionOrArea(
                            action.areaName,
                            action.image,
                            action.areaDuration,
                        )}

                    {action.condition &&
                        renderConditionOrArea(
                            action.condition,
                            action.image,
                            action.conditionDuration,
                        )}

                    {renderActionDetails(action)}
                </>
            }
            footer={
                <ActionDetailsBox>
                    {action.costs.map(({ resource, amount }) => (
                        <Typography variant="body2">
                            {`${
                                amount > 1 ? `${amount} ` : ''
                            }${Utils.toProperCase(ActionResource[resource])}`}
                        </Typography>
                    ))}
                    {action.ritual && (
                        <Typography variant="body2" color="textSecondary">
                            Ritual
                        </Typography>
                    )}
                </ActionDetailsBox>
            }
        >
            {children}
        </BaseTooltip>
    );
}
