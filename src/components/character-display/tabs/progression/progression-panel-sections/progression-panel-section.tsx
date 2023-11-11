import { Paper, Typography } from '@mui/material';
import React, { ReactNode } from 'react';

interface ProgressionPanelSectionProps {
    label: string;
    children: ReactNode;
}

export function ProgressionPanelSection({
    label,
    children,
}: ProgressionPanelSectionProps) {
    return (
        <Paper elevation={3} sx={{ padding: '0.5rem', flex: 1 }}>
            <Typography variant="body2" gutterBottom>
                {label}
            </Typography>
            {children}
        </Paper>
    );
}
