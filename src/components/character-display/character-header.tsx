import React, { useMemo } from 'react';
import styled from '@emotion/styled';
import { Paper, Box, Typography } from '@mui/material';
import { CharacterClassInfo } from '../../models/character/types';
import { useCharacter } from '../../context/character-context/character-context';
import { WeaveImages } from '../../api/weave/weave-images';
import { SettingsMenu } from './settings-menu/settings-menu';
import { ShareButton } from './buttons/share-button';
import { ResetButton } from './buttons/reset-button';
import { useResponsive } from '../../hooks/use-responsive';

const StyledPaper = styled(Paper)`
    padding: 1rem;
    position: relative;
`;

const ImageContainer = styled(Box)`
    position: relative;
    margin-right: 2rem;
    width: 88px;
    flex-shrink: 0;

    @media (max-width: 768px) {
        margin-right: 0.75rem;
    }
`;

const ClassImage = styled.img`
    height: 100%;
    width: 100%;
    object-fit: cover;
`;

const LevelBox = styled(Box)`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 3em;
    font-weight: bold;
    color: white;
    text-shadow:
        -1px -1px 0px black,
        1px -1px 0px black,
        -1px 1px 0px black,
        1px 1px 0px black,
        -2px 0px 0px black,
        2px 0px 0px black,
        0px -2px 0px black,
        0px 2px 0px black;
`;

const ClassLevel = styled.span`
    color: gray;
`;

const ButtonBox = styled(Box)`
    position: absolute;
    right: 0.75rem;
    top: 0.75rem;
`;

export function CharacterHeader() {
    const { isMobile } = useResponsive();
    const { character } = useCharacter();

    const imageName = useMemo(() => {
        const classes = character.getClassInfo();

        const highestLevelClass = classes.sort(
            (a, b) => b.levels.length - a.levels.length,
        )[0];

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
                    <ClassLevel>{data.levels.length}</ClassLevel>
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
        <StyledPaper elevation={2}>
            <Box display="flex" flexDirection="column">
                <Box display="flex" alignItems="stretch">
                    <ButtonBox>
                        <ResetButton />
                        <ShareButton />
                        <SettingsMenu />
                    </ButtonBox>

                    {imageName && (
                        <ImageContainer>
                            <ClassImage
                                src={WeaveImages.getPath(imageName, 88)}
                                alt="Character Class"
                            />
                            <LevelBox>{character.getTotalLevel()}</LevelBox>
                        </ImageContainer>
                    )}

                    <Box>
                        <Typography
                            variant={isMobile ? 'h4' : 'h3'}
                            align="left"
                        >
                            {character.name}
                        </Typography>
                        <Typography
                            variant={isMobile ? 'h6' : 'h5'}
                            align="left"
                        >
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
        </StyledPaper>
    );
}
