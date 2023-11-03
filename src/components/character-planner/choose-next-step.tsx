import React, { ReactNode, useCallback } from 'react';
import { Box, Typography, Card, CardActionArea, Grid } from '@mui/material';
import styled from '@emotion/styled';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import EditIcon from '@mui/icons-material/Edit';
import { useCharacter } from '../../context/character-context/character-context';
import { Character } from '../../models/character/character';
import { PlannerStepTitle } from './planner-header/planner-step-title';

const OptionName = styled(Typography)`
    position: absolute;
    bottom: 8px;
    left: 8px;
    text-shadow: 3px 3px 5px rgba(0, 0, 0, 0.7);
`;

export function ChooseNextStep() {
    const { character, setCharacter } = useCharacter();

    const levelUpCharacter = useCallback(() => {
        const newCharacter = character.levelUp();
        setCharacter(newCharacter);
    }, [character]);

    const manageLevels = useCallback(async () => {
        const newCharacter = await character.manageLevels();
        setCharacter(newCharacter);
    }, [character]);

    const options: {
        label: string;
        onClick: () => void;
        visible?: (character: Character) => boolean;
        media: ReactNode;
    }[] = [
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
            <PlannerStepTitle title="Ready to level up?" />

            <Grid container style={{ flex: 1 }} spacing={2} mt={1}>
                {options
                    .filter(
                        ({ visible }) =>
                            typeof visible === 'undefined' ||
                            visible(character),
                    )
                    .map(({ label, onClick, media }) => (
                        <Grid item xs={12} sm={6} sx={{ flex: 1 }}>
                            <Card key={label} elevation={2}>
                                <CardActionArea
                                    onClick={onClick}
                                    sx={{ height: '160px' }}
                                >
                                    <OptionName variant="h6">
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                gap: '.5rem',
                                            }}
                                        >
                                            {media}
                                            {label}
                                        </Box>
                                    </OptionName>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
            </Grid>
        </Box>
    );
}
