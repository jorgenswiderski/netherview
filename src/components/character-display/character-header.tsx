import React, { useMemo } from 'react';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { Character } from '../../models/character/character';

interface CharacterHeaderProps {
    character: Character;
}

export function CharacterHeader({ character }: CharacterHeaderProps) {
    const imagePath = useMemo(() => {
        const classes = character.getClasses();
        const highestLevelClass = classes.sort(
            (a, b) => b.levels - a.levels,
        )[0];

        // If there's a subclass with an image, use it, otherwise fall back to the class image
        return (
            highestLevelClass?.subclass?.image || highestLevelClass?.class.image
        );
    }, [character]);

    const shouldDisplayLevels = useMemo(() => {
        const uniqueClasses = new Set(
            character.getClasses().map((cls) => cls.class.name),
        );

        return uniqueClasses.size > 1;
    }, [character]);

    return (
        <Paper elevation={2} style={{ padding: '1rem' }}>
            <Box display="flex" flexDirection="column">
                <Box display="flex" alignItems="stretch">
                    {imagePath && (
                        <Box
                            position="relative"
                            mr={2}
                            sx={{ width: '88px', flexShrink: 0 }}
                        >
                            <img
                                src={imagePath}
                                alt="Character Class"
                                style={{
                                    height: '100%',
                                    width: '100%',
                                    objectFit: 'cover',
                                }}
                            />
                            <Box
                                position="absolute"
                                top="50%"
                                left="50%"
                                sx={{
                                    transform: 'translate(-50%, -50%)',
                                    fontSize: '3em',
                                    fontWeight: 'bold',
                                    color: 'white',
                                    textShadow: `
                                        -1px -1px 0px black,
                                        1px -1px 0px black,
                                        -1px 1px 0px black,
                                        1px 1px 0px black,
                                        -2px 0px 0px black,
                                        2px 0px 0px black,
                                        0px -2px 0px black,
                                        0px 2px 0px black
                                    `,
                                }}
                            >
                                {character.levels.length}
                            </Box>
                        </Box>
                    )}
                    <Box>
                        <Typography variant="h3" align="left">
                            {character.name}
                        </Typography>
                        <Typography variant="h5" align="left">
                            {character.subrace?.name ?? character.race?.name}
                            {character.levels.length > 0 &&
                                ` ${character
                                    .getClasses()
                                    .map((data) => {
                                        if (shouldDisplayLevels) {
                                            return `${
                                                data?.subclass
                                                    ? data.subclass.name
                                                    : data.class.name
                                            } (${data.levels})`;
                                        }

                                        return `${
                                            data?.subclass
                                                ? data.subclass.name
                                                : data.class.name
                                        }`;
                                    })
                                    .join(' / ')}`}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Paper>
    );
}
