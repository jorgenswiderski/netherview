import React from 'react';
import styled from '@emotion/styled';
import { IconButton, Paper, Typography } from '@mui/material';
import UndoIcon from '@mui/icons-material/Undo';
import { useResponsive } from '../../../hooks/use-responsive';
import { useCharacter } from '../../../context/character-context/character-context';

const StyledPaper = styled(Paper)`
    position: relative;
    width: 100%;
    text-align: center;
    padding: 1rem;
    box-sizing: border-box;

    @media (max-width: 768px) {
        min-height: 3rem;
        padding: 0.5rem;
    }
`;

interface PlannerStepTitleProps {
    title: string;
}

export function PlannerStepTitle({ title }: PlannerStepTitleProps) {
    const { isMobile } = useResponsive();
    const { undo, canUndo } = useCharacter();

    return (
        <StyledPaper elevation={2}>
            {canUndo && !isMobile && (
                <IconButton
                    onClick={undo}
                    style={{ position: 'absolute', left: '1rem' }}
                >
                    <UndoIcon />
                </IconButton>
            )}
            <Typography variant={isMobile ? 'h6' : 'h4'}>{title}</Typography>
        </StyledPaper>
    );
}
