import styled from '@emotion/styled';
import { Button } from '@mui/material';
import React, { ReactNode } from 'react';

const StyledButton = styled(Button)`
    @media (max-width: 768px) {
        min-height: 3rem;
    }
`;

interface PlannerNextButtonProps {
    children: ReactNode;
    onClick: () => void;
    disabled: boolean;
}

export function PlannerNextButton({
    children,
    onClick,
    disabled,
}: PlannerNextButtonProps) {
    return (
        <StyledButton
            variant="contained"
            color="primary"
            onClick={onClick}
            disabled={disabled}
            fullWidth
        >
            {children}
        </StyledButton>
    );
}
