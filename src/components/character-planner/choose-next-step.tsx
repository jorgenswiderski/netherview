import React, { ReactNode, useCallback } from 'react';
import { Box, Typography, Card, CardActionArea, Grid } from '@mui/material';
import styled from '@emotion/styled';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import EditIcon from '@mui/icons-material/Edit';
import { useCharacter } from '../../context/character-context/character-context';
import { Character } from '../../models/character/character';
import { PlannerStepTitle } from './planner-header/planner-step-title';
import { useResponsive } from '../../hooks/use-responsive';

const StyledGridContainer = styled(Grid)`
    flex: 1;

    @media (max-width: 600px) {
        flex: unset;
        margin-left: -6px;
        width: calc(100% + 12px);

        & > .MuiGrid-item {
            padding: 0 6px;
        }
    }
`;

const StyledGridItem = styled(Grid)`
    flex: 1;
`;

const OptionName = styled(Typography)`
    position: absolute;
    bottom: 8px;
    left: 8px;
    text-shadow: 3px 3px 5px rgba(0, 0, 0, 0.7);

    @media (max-width: 600px) {
        position: initial;
        bottom: initial;
        left: initial;
        font-size: 1rem;
        text-align: center;
    }
`;

const CardContentBox = styled(Box)`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;

    @media (max-width: 600px) {
        width: 100%;
        justify-content: center;
    }
`;

interface StepInfo {
    label: string;
    onClick: () => void;
    visible?: (character: Character) => boolean;
    media: ReactNode;
}

function NextStepGrid({ options }: { options: StepInfo[] }) {
    const { isMobile } = useResponsive();
    const { character } = useCharacter();

    return (
        <StyledGridContainer container spacing={2} mt={isMobile ? 0 : 1}>
            {options
                .filter(
                    ({ visible }) =>
                        typeof visible === 'undefined' || visible(character),
                )
                .map(({ label, onClick, media }) => (
                    <StyledGridItem item xs={12} sm={6} key={label}>
                        <Card elevation={2}>
                            <CardActionArea
                                onClick={onClick}
                                sx={{
                                    height: isMobile ? '3rem' : '160px',
                                }}
                            >
                                <OptionName variant="h6">
                                    <CardContentBox>
                                        {media}
                                        {label}
                                    </CardContentBox>
                                </OptionName>
                            </CardActionArea>
                        </Card>
                    </StyledGridItem>
                ))}
        </StyledGridContainer>
    );
}

export function ChooseNextStep() {
    const { isMobile } = useResponsive();
    const { character, setCharacter } = useCharacter();

    const levelUpCharacter = useCallback(() => {
        const newCharacter = character.levelUp();
        setCharacter(newCharacter);
    }, [character]);

    const manageLevels = useCallback(async () => {
        const newCharacter = await character.manageLevels();
        setCharacter(newCharacter);
    }, [character]);

    const options: StepInfo[] = [
        {
            label: 'Level Up',
            onClick: levelUpCharacter,
            visible: (char) => char.canLevel(),
            media: <KeyboardDoubleArrowUpIcon sx={{ height: '100%' }} />,
        },
        {
            label: 'Revise Levels',
            onClick: manageLevels,
            media: <EditIcon sx={{ height: '100%' }} />,
        },
    ];

    return isMobile ? (
        <NextStepGrid options={options} />
    ) : (
        <Box
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
                width: '100%',
            }}
        >
            <PlannerStepTitle title="Ready to level up?" />

            <NextStepGrid options={options} />
        </Box>
    );
}
