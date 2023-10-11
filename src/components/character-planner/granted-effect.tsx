import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { GrantableEffect } from 'planner-types/src/types/grantable-effect';

interface GrantedEffectProps {
    effect: GrantableEffect;
}

export default function GrantedEffect({ effect }: GrantedEffectProps) {
    return (
        <Tooltip title={effect.description || ''} key={effect.name}>
            <div>
                <Typography variant="body2">{effect.name}</Typography>
            </div>
        </Tooltip>
    );
}
