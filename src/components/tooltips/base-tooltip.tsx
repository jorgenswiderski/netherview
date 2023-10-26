// base-tooltip.tsx
import React from 'react';
import { Box, Tooltip, TooltipProps } from '@mui/material';
import styled from '@emotion/styled';
import { darken } from '@mui/system';
import { WeaveApi } from '../../api/weave/weave';

const MainBox = styled(Box)`
    position: relative;
`;

const Section = styled(Box)`
    display: flex;
    flex-direction: column;
    padding: 0.5rem;
`;

const HeaderBox = styled(Section)`
    align-items: stretch;
`;

const BodyBox = styled(Section)`
    gap: 0.25rem;
    // background: rgb(16, 12, 9);
`;

const QuoteBox = styled(Section)`
    background: ${darken('#333', 0.1)};
    opacity: 0.6;
    gap: 0.5rem;
`;

const FooterBox = styled(Section)`
    flex-direction: row;

    background: ${darken('#333', 0.3)};
`;

const Icon = styled('img')`
    position: absolute;
    top: -5%;
    right: -5%;
    opacity: 0.7;
    width: 120px;
    height: 120px;
`;

interface BaseTooltipProps extends Omit<TooltipProps, 'title'> {
    header?: React.ReactNode;
    body?: React.ReactNode;
    quote?: React.ReactNode;
    footer?: React.ReactNode;
    image?: string;
    name: string;
    children: React.ReactElement;
}

export function BaseTooltip({
    header,
    body,
    quote,
    footer,
    image,
    name,
    children,
    ...props
}: BaseTooltipProps) {
    return (
        <Tooltip
            {...props}
            PopperProps={{
                sx: {
                    '.MuiTooltip-tooltip': {
                        padding: 0,
                        borderRadius: '0.4rem',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
                        overflow: 'hidden',
                        minWidth: 'min(400px, 90vw)',
                        // minHeight: '120px',
                    },
                },
                style: {
                    pointerEvents: 'none',
                },
                modifiers: [
                    {
                        name: 'flip',
                        options: {
                            fallbackPlacements: [
                                'top',
                                'right',
                                'bottom',
                                'left',
                            ],
                        },
                    },
                    {
                        name: 'preventOverflow',
                        options: {
                            altAxis: true,
                            tether: true,
                            tetherOffset: () => 20,
                            boundary: 'viewport',
                        },
                    },
                ],
                ...props.PopperProps,
            }}
            title={
                <MainBox>
                    {header && <HeaderBox>{header}</HeaderBox>}
                    {body && <BodyBox>{body}</BodyBox>}
                    {quote && <QuoteBox>{quote}</QuoteBox>}
                    {footer && <FooterBox>{footer}</FooterBox>}
                    {image && (
                        <Icon src={WeaveApi.getImagePath(image)} alt={name} />
                    )}
                </MainBox>
            }
        >
            {children}
        </Tooltip>
    );
}
