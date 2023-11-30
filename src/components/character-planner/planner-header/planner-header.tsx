import React from 'react';
import { Box, Button } from '@mui/material';
import UndoIcon from '@mui/icons-material/Undo';
import styled from '@emotion/styled';
import { useResponsive } from '../../../hooks/use-responsive';
import { PlannerStepTitle } from './planner-step-title';
import { PlannerNextButton } from './planner-next-button';
import { useCharacter } from '../../../context/character-context/character-context';

const StyledBox = styled(Box)`
    display: flex;
    flex-direction: column;
    gap: 0.75rem;

    width: 100%;

    @media (max-width: 768px) {
        flex-direction: row;
    }
`;

interface PlannerHeaderProps {
    title: string;
    buttonLabel?: string;
    onButtonClick: () => void;
    buttonDisabled: boolean;
}

export function PlannerHeader({
    title,
    buttonLabel = 'Next',
    onButtonClick,
    buttonDisabled,
}: PlannerHeaderProps) {
    const { isMobile } = useResponsive();
    const { undo, canUndo } = useCharacter();

    return (
        <StyledBox>
            {canUndo && isMobile && (
                <Button variant="contained" color="inherit" onClick={undo}>
                    <UndoIcon />
                </Button>
            )}
            {(!isMobile || buttonDisabled) && (
                <PlannerStepTitle title={title} />
            )}

            {(!isMobile || !buttonDisabled) && (
                <PlannerNextButton
                    onClick={onButtonClick}
                    disabled={buttonDisabled}
                >
                    {buttonLabel}
                </PlannerNextButton>
            )}
        </StyledBox>
    );
}
