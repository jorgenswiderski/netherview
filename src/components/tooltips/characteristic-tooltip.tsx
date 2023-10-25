// action-tooltip.tsx
import React from 'react';
import { Typography } from '@mui/material';
import { Characteristic } from 'planner-types/src/types/grantable-effect';
import { BaseTooltip } from './base-tooltip';

interface CharacteristicTooltipProps {
    characteristic?: Characteristic;
    children: React.ReactElement;
}

export function CharacteristicTooltip({
    characteristic,
    children,
}: CharacteristicTooltipProps) {
    if (!characteristic) {
        return children;
    }

    return (
        <BaseTooltip
            name={characteristic.name}
            image={characteristic.image}
            header={
                <>
                    <Typography variant="h6">{characteristic.name}</Typography>
                    <Typography variant="subtitle2" color="textSecondary" />
                </>
            }
            quote={
                <Typography
                    variant="body2"
                    style={{ marginRight: characteristic.image ? '90px' : 0 }}
                >
                    {characteristic.description}
                </Typography>
            }
        >
            {children}
        </BaseTooltip>
    );
}
