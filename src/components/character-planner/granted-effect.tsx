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
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: '8px',
                }}
            >
                {effect.image && (
                    <img
                        src={effect.image}
                        alt={effect.name}
                        style={{ height: '100%' }}
                    />
                )}
                <Typography variant="body2" style={{ fontWeight: 600 }}>
                    {effect.name}
                </Typography>
            </div>
        </Tooltip>
    );
}
