import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { GrantableEffect } from 'planner-types/src/types/grantable-effect';
import styled from '@emotion/styled';
import Paper from '@mui/material/Paper';
import ImageWithFallback from './image-with-fallback';

interface GrantedEffectProps {
    effect: GrantableEffect;
    elevation: number;
    style?: React.CSSProperties;
}

const StyledPaper = styled(Paper)`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    padding: 2px 4px;
    margin: 4px 0;
`;

export default function GrantedEffect({
    effect,
    elevation,
    style,
}: GrantedEffectProps) {
    return (
        <Tooltip title={effect.description || ''} key={effect.name}>
            <StyledPaper elevation={elevation} style={style}>
                {effect.image && (
                    <ImageWithFallback
                        src={effect.image}
                        placeholder={<div>•</div>}
                        fallback={<div>•</div>}
                        alt=""
                        style={{ width: '24px' }}
                    />
                )}
                <Typography variant="body2" style={{ fontWeight: 600 }}>
                    {effect.name}
                </Typography>
            </StyledPaper>
        </Tooltip>
    );
}
