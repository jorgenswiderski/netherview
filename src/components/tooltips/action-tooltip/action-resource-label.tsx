import React, { useMemo } from 'react';
import {
    ActionCost,
    ActionResource,
} from '@jorgenswiderski/tomekeeper-shared/dist/types/action';
import { Typography } from '@mui/material';
import { Utils, safeAssert } from '../../../models/utils';

const formatterConfig: {
    resources: ActionResource[];
    formatter:
        | ((
              amount: number,
              resource: ActionResource,
              defaultValue: string,
          ) => string)
        | string;
}[] = [
    {
        resources: [
            ActionResource.spellSlot1,
            ActionResource.spellSlot2,
            ActionResource.spellSlot3,
            ActionResource.spellSlot4,
            ActionResource.spellSlot5,
            ActionResource.spellSlot6,
        ],
        formatter: (amount, resource) =>
            `Level ${ActionResource[resource].match(/\d+/)![0]} Spell Slot`,
    },
    {
        resources: [ActionResource.movementHalf],
        formatter: 'Movement (Half Cost)',
    },
    {
        resources: [ActionResource.bonus],
        formatter: 'Bonus Action',
    },
    {
        resources: [
            ActionResource.arcaneRecovery,
            ActionResource.bardicInspiration,
            ActionResource.channelDivinity,
            ActionResource.channelOath,
            ActionResource.fungalInfestation,
            ActionResource.ki,
            ActionResource.layOnHands,
            ActionResource.naturalRecovery,
            ActionResource.rage,
            ActionResource.warPriest,
            ActionResource.wildShape,
            ActionResource.tidesOfChaos,
        ],
        formatter: (amount, resource, defaultValue) =>
            `${defaultValue} Charges`,
    },
    {
        resources: [
            ActionResource.action,
            ActionResource.reaction,
            ActionResource.ki,
            ActionResource.movement,
            ActionResource.sorceryPoints,
            ActionResource.superiorityDice,
            ActionResource.luckPoints,
            ActionResource.eyestalkAction, // unused
        ],
        formatter: (amount, resource, defaultValue) => defaultValue,
    },
];

const formatters = Object.fromEntries(
    formatterConfig.flatMap(({ resources, formatter }) =>
        resources.map((resource) => [resource, formatter]),
    ),
);

Object.keys(ActionResource).forEach((resource) => {
    const res = parseInt(resource, 10);

    if (Number.isNaN(res)) {
        return;
    }

    safeAssert(
        formatters[res] || res === ActionResource.NONE,
        `Expected action resource '${ActionResource[res]}' (${res}) to have a defined label formatter!`,
    );
});

interface ActionResourceLabelProps {
    cost: ActionCost;
}

export function ActionResourceLabel({
    cost: { resource, amount },
}: ActionResourceLabelProps) {
    const label = useMemo(() => {
        if (typeof formatters[resource] === 'string') {
            return formatters[resource];
        }

        const defaultValue = Utils.toProperCase(
            ActionResource[resource].replaceAll(/(?<=.)([A-Z])/g, ' $1'),
        );

        return (formatters[resource] as Function)(
            amount,
            resource,
            defaultValue,
        );
    }, [resource, amount]);

    return (
        <Typography variant="body2" key={resource}>
            {`${amount > 1 ? `${amount} ` : ''}${label}`}
        </Typography>
    );
}
