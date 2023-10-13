import React from 'react';
import { Typography } from '@mui/material';

interface CharacterItemsProps {}

// eslint-disable-next-line no-empty-pattern
export default function CharacterItems({}: CharacterItemsProps) {
    return (
        <>
            <Typography variant="h6" align="left" gutterBottom>
                Equipped Items:
            </Typography>
            <Typography variant="body1" align="left">
                (Items feature not yet implemented.)
            </Typography>
        </>
    );
}
