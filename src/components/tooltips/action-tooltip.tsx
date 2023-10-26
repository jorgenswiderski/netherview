// action-tooltip.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import {
    ActionRangeType,
    ActionSchool,
    ActionResource,
    IActionBase,
} from 'planner-types/src/types/action';
import styled from '@emotion/styled';
import { AbilityScore } from 'planner-types/src/types/ability';
import { DamageType } from 'planner-types/src/types/damage';
import { BaseTooltip } from './base-tooltip';
import { Utils } from '../../models/utils';
import { WeaveApi } from '../../api/weave/weave';

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
        .map(([key, formatter]) =>
            formatter(key, action[key as keyof IActionBase]),
        )
        .filter(Boolean)
        .map((string) => <Typography variant="body2">{string}</Typography>);

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
                <ConditionIcon src={WeaveApi.getImagePath(image)} alt={name} />
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
                        <>
                            {action.damage && (
                                <Typography variant="body1" ml={1}>
                                    {`${action.damage} ${
                                        DamageType[action.damageType]
                                    }`}
                                </Typography>
                            )}

                            {action.extraDamage && (
                                <Typography variant="body1" ml={1}>
                                    {`+${action.extraDamage} ${
                                        DamageType[
                                            action.extraDamageType ??
                                                action.damageType
                                        ]
                                    }`}
                                </Typography>
                            )}
                        </>
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
                    {action.cost && (
                        <Typography variant="body2">
                            {Utils.toProperCase(ActionResource[action.cost])}
                        </Typography>
                    )}
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
