import { Typography } from '@mui/material';
import { DamageType, damageTypeColor } from 'planner-types/src/types/damage';
import React, { useMemo } from 'react';

export function DamageText({
    damages,
}: {
    damages: (any[] | string | undefined)[];
}) {
    const damagesParsed = useMemo(
        () =>
            (
                damages.filter((value) =>
                    Array.isArray(value) ? value[0] && value[1] : value,
                ) as (any[] | string)[]
            ).map((raw) => {
                let damageStr: string;

                if (Array.isArray(raw)) {
                    damageStr = `${raw[0]} ${DamageType[raw[1]]}`;
                } else {
                    damageStr = raw;
                }

                const match = /^(.+?)\s+(\w+)$/.exec(damageStr);

                if (!match || !match[1] || !match[2]) {
                    throw new Error('failed to parse damage text');
                }

                return {
                    amount: match[1],
                    type: DamageType[match[2] as any] as unknown as DamageType,
                };
            }),
        [damages],
    );

    return damagesParsed.map(({ amount, type }, index) => (
        <Typography color={damageTypeColor[type]}>{`${
            index > 0 ? '+' : ''
        }${amount} ${DamageType[type]}`}</Typography>
    ));
}
