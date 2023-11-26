// action-tooltip.tsx
import React from 'react';
import { Typography } from '@mui/material';
import { IPassive } from '@jorgenswiderski/tomekeeper-shared/dist/types/grantable-effect';
import { BaseTooltip } from './base-tooltip';

interface PassiveTooltipProps {
    passive?: IPassive;
    children: React.ReactElement;
}

export function PassiveTooltip({ passive, children }: PassiveTooltipProps) {
    if (!passive) {
        return children;
    }

    return (
        <BaseTooltip
            name={passive.name}
            image={passive.image}
            header={
                <>
                    <Typography variant="h6">{passive.name}</Typography>
                    <Typography variant="subtitle2" color="textSecondary" />
                </>
            }
            quote={
                <Typography
                    variant="body2"
                    style={{ marginRight: passive.image ? '90px' : 0 }}
                >
                    {passive.description}
                </Typography>
            }
        >
            {children}
        </BaseTooltip>
    );
}
