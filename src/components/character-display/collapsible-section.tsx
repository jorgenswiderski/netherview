import React, { ReactNode } from 'react';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface CollapsibleSectionProps {
    title: string;
    content: ReactNode[];
    elevation: number;
}

export function CollapsibleSection({
    title,
    content,
    elevation,
}: CollapsibleSectionProps) {
    return (
        <Accordion defaultExpanded elevation={elevation}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">{title}</Typography>
            </AccordionSummary>
            <AccordionDetails>{content}</AccordionDetails>
        </Accordion>
    );
}
