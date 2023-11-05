import React from 'react';
import styled from '@emotion/styled';
import { Paper, Typography } from '@mui/material';
import { useResponsive } from '../../../hooks/use-responsive';

const StyledPaper = styled(Paper)`
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

    return (
        <StyledPaper elevation={2}>
            <Typography variant={isMobile ? 'h5' : 'h4'}>{title}</Typography>
        </StyledPaper>
    );
}
