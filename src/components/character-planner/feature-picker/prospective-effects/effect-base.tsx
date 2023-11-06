import React from 'react';
import styled from '@emotion/styled';
import { Paper, Typography } from '@mui/material';
import { ImageWithFallback } from '../../image-with-fallback';

const StyledPaper = styled(Paper)`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    padding: 2px 4px;
`;

interface EffectBaseProps {
    image: string | React.ReactNode;
    label: string;
    elevation: number;
    style?: React.CSSProperties;
}

export function EffectBase({
    image,
    label,
    elevation,
    style,
}: EffectBaseProps) {
    return (
        <StyledPaper elevation={elevation} style={style}>
            {typeof image === 'string' ? (
                <ImageWithFallback
                    src={image}
                    placeholder={<div>•</div>}
                    fallback={<div>•</div>}
                    alt=""
                    style={{ width: '24px' }}
                />
            ) : (
                image
            )}
            <Typography variant="body2" style={{ fontWeight: 600 }}>
                {label}
            </Typography>
        </StyledPaper>
    );
}
