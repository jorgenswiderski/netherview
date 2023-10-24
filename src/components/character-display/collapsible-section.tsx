import React, { ReactNode } from 'react';
import styled from '@emotion/styled';
import {
    Box,
    Accordion,
    AccordionSummary,
    Typography,
    AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const HeaderBox = styled(Box)`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    width: 100%;
`;

const HeaderInnerBox = styled(Box)`
    display: flex;
    flex-direction: row;
    align-items: center;

    margin-right: 0.5rem;
`;

interface CollapsibleSectionProps {
    title: string | ReactNode;
    children: ReactNode;
    elevation: number;
    headerButtons?: ReactNode;
    style?: React.CSSProperties;
    disabled?: boolean;
    defaultExpanded?: boolean;
}

export function CollapsibleSection({
    title,
    children,
    elevation,
    headerButtons,
    style,
    disabled = false,
    defaultExpanded = true,
    ...props
}: CollapsibleSectionProps) {
    return (
        <Accordion
            defaultExpanded={defaultExpanded}
            elevation={elevation}
            disableGutters
            style={style}
            disabled={disabled}
            {...props}
        >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <HeaderBox>
                    <Typography variant="subtitle1">{title}</Typography>
                    {headerButtons && (
                        <HeaderInnerBox>{headerButtons}</HeaderInnerBox>
                    )}
                </HeaderBox>
            </AccordionSummary>
            <AccordionDetails>{children}</AccordionDetails>
        </Accordion>
    );
}
