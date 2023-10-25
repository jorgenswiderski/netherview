import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import styled from '@emotion/styled';

const PlannerHeader = styled(Paper)`
    width: 100%;
    text-align: center;
    padding: 1rem;
    box-sizing: border-box;
`;

interface LevelUpProps {
    onClick: () => void;
}

export function LevelUp({ onClick }: LevelUpProps) {
    return (
        <Box
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
                width: '100%',
            }}
        >
            <PlannerHeader elevation={2}>
                <Typography variant="h4">Ready to level up?</Typography>
            </PlannerHeader>
            <Button
                variant="contained"
                color="primary"
                onClick={onClick}
                fullWidth
            >
                Level Up
            </Button>
        </Box>
    );
}
