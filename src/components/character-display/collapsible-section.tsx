import React, { ReactNode } from 'react';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface CollapsibleSectionProps {
    title: string;
    children: ReactNode;
    elevation: number;
    style?: React.CSSProperties;
}

export function CollapsibleSection({
    title,
    children,
    elevation,
    style,
}: CollapsibleSectionProps) {
    return (
        <Accordion
            defaultExpanded
            elevation={elevation}
            disableGutters
            style={style}
        >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">{title}</Typography>
            </AccordionSummary>
            <AccordionDetails>{children}</AccordionDetails>
        </Accordion>
    );
}
