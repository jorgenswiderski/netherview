import React from 'react';
import Typography from '@mui/material/Typography';
import { Character } from '../../models/character/character';

interface CharacterDisplayProps {
    character: Character;
}

export default function CharacterDisplay({ character }: CharacterDisplayProps) {
    return (
        <>
            <Typography variant="h3" align="left" gutterBottom>
                {character.name}
            </Typography>
            <Typography variant="h5" align="left">
                {`${character.subrace?.name ?? character.race?.name} ${
                    character.levels[0]
                }`}
            </Typography>
        </>
    );
}
