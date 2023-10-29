import React, { useMemo } from 'react';
import { Paper, Box, Typography } from '@mui/material';
import { CharacterClassInfo } from '../../models/character/types';
import { WeaveApi } from '../../api/weave/weave';
import { useCharacter } from '../../context/character-context/character-context';

export function CharacterHeader() {
    const { character } = useCharacter();

    const imageName = useMemo(() => {
        const classes = character.getClassInfo();
        const highestLevelClass = classes.sort(
            (a, b) => b.levels.length - a.levels.length,
        )[0];

        // If there's a subclass with an image, use it, otherwise fall back to the class image
        return (
            highestLevelClass?.subclass?.image || highestLevelClass?.class.image
        );
    }, [character]);

    const shouldDisplayLevels = useMemo(() => {
        const uniqueClasses = new Set(
            character.getClassInfo().map((cls) => cls.class.name),
        );

        return uniqueClasses.size > 1;
    }, [character]);

    function formatClassLevel(data: CharacterClassInfo) {
        if (shouldDisplayLevels) {
            return (
                <span>
                    {data?.subclass ? data.subclass.name : data.class.name}{' '}
                    <span style={{ color: 'gray' }}>{data.levels.length}</span>
                </span>
            );
        }

        return `${data?.subclass ? `${data.subclass.name} ` : ''} ${
            data.class.name
        }`;
    }

    const race = useMemo(() => character.getRace(), [character]);
    const subrace = useMemo(() => character.getSubrace(), [character]);

    return (
        <Paper elevation={2} style={{ padding: '1rem' }}>
            <Box display="flex" flexDirection="column">
                <Box display="flex" alignItems="stretch">
                    {imageName && (
                        <Box
                            position="relative"
                            mr={2}
                            sx={{ width: '88px', flexShrink: 0 }}
                        >
                            <img
                                src={WeaveApi.getImagePath(imageName)}
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
                                {character.getTotalLevel()}
                            </Box>
                        </Box>
                    )}
                    <Box>
                        <Typography variant="h3" align="left">
                            {character.name}
                        </Typography>
                        <Typography variant="h5" align="left">
                            {subrace?.name ?? race?.name}{' '}
                            {character.root.children &&
                                character.root.children.length > 1 && (
                                    <span>
                                        {character
                                            .getClassInfo()
                                            .map((data, index) => (
                                                <React.Fragment
                                                    key={data.class.name}
                                                >
                                                    {formatClassLevel(data)}
                                                    {index !==
                                                        character.getClassInfo()
                                                            .length -
                                                            1 && ' / '}
                                                </React.Fragment>
                                            ))}
                                    </span>
                                )}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Paper>
    );
}
