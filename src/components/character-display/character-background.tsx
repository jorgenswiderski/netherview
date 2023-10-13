import React from 'react';
import styled from '@emotion/styled';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Character } from '../../models/character/character';

interface CharacterBackgroundProps {
    character: Character;
}

const BackgroundContainer = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: hidden; // to ensure rotated image doesn't overflow
`;

const RotationContainer = styled.div`
    width: 100%;
    height: 100%;
    background-image: ${(props: { bgImage?: string }) =>
        props.bgImage ? `url(${props.bgImage})` : 'none'};
    background-position: right;
    background-repeat: no-repeat;
    opacity: 0.15;
`;

export default function CharacterBackground({
    character,
}: CharacterBackgroundProps) {
    return (
        <Paper elevation={2} style={{ padding: '1rem', position: 'relative' }}>
            <BackgroundContainer>
                <RotationContainer bgImage={character.background?.image} />
            </BackgroundContainer>
            <Typography
                variant="h6"
                style={{ position: 'relative', zIndex: 1 }}
            >
                Background: {character.background?.name}
            </Typography>
        </Paper>
    );
}
