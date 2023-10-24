import React, { ReactElement } from 'react';
import Tooltip from '@mui/material/Tooltip';
import { IEquipmentItem } from 'planner-types/src/types/equipment-item';

interface ItemTooltipProps {
    item?: IEquipmentItem;
    children: ReactElement<any, any>;
}

export function ItemTooltip({ item, children }: ItemTooltipProps) {
    return (
        <Tooltip
            title={item?.description || ''}
            PopperProps={{ style: { pointerEvents: 'none' } }}
        >
            {children}
        </Tooltip>
    );
}
