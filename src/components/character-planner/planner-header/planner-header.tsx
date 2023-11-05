import React from 'react';
import { PlannerNextButton } from './planner-next-button';
import { PlannerStepTitle } from './planner-step-title';
import { useResponsive } from '../../../hooks/use-responsive';

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
