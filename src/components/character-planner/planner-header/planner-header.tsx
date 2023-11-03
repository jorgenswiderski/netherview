import React from 'react';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { PlannerNextButton } from './planner-next-button';
import { PlannerStepTitle } from './planner-step-title';

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
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <>
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
        </>
    );
}
