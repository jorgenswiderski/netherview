import React, { useCallback } from 'react';
import {
    Box,
    Typography,
    Paper,
    Card,
    CardActionArea,
    Grid,
} from '@mui/material';
import styled from '@emotion/styled';
import { useCharacter } from '../../context/character-context/character-context';
import { Character } from '../../models/character/character';

const PlannerHeader = styled(Paper)`
    width: 100%;
    text-align: center;
    padding: 1rem;
    box-sizing: border-box;
`;

const OptionName = styled(Typography)`
    position: absolute;
    bottom: 8px;
    left: 8px;
    text-shadow: 3px 3px 5px rgba(0, 0, 0, 0.7);

    @media (min-width: 600px) {
        font-size: 1rem;
    }
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
    }[] = [
        {
            label: 'Level Up',
            onClick: levelUpCharacter,
            visible: (char) => char.canLevel(),
        },
        { label: 'Revise Levels', onClick: manageLevels },
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
            <PlannerHeader elevation={2}>
                <Typography variant="h4">Ready to level up?</Typography>
            </PlannerHeader>

            <Grid container style={{ flex: 1 }} spacing={2} mt={1}>
                {options
                    .filter(
                        ({ visible }) =>
                            typeof visible === 'undefined' ||
                            visible(character),
                    )
                    .map(({ label, onClick }) => (
                        <Grid item xs={12} sm={6} sx={{ flex: 1 }}>
                            <Card
                                key={label}
                                elevation={2}
                                sx={{ height: '160px' }}
                            >
                                <CardActionArea
                                    onClick={onClick}
                                    sx={{ height: '100%' }}
                                >
                                    <OptionName>{label}</OptionName>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
            </Grid>
        </Box>
    );
}
