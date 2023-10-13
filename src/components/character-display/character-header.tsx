import React from 'react';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { Character } from '../../models/character/character';

interface CharacterHeaderProps {
    character: Character;
}

export function CharacterHeader({ character }: CharacterHeaderProps) {
    return (
        <Paper elevation={2} style={{ padding: '1rem' }}>
            <Typography variant="h3" align="left">
                {character.name}
            </Typography>

            <Typography variant="h5" align="left">
                {character.subrace?.name ?? character.race?.name}
                {character.levels.length > 0 &&
                    ` ${character
                        .getClasses()
                        .map(
                            (data) =>
                                `${data?.subclass ?? data.class} (${
                                    data.levels
                                })`,
                        )
                        .join(' / ')}`}
            </Typography>
        </Paper>
    );
}
