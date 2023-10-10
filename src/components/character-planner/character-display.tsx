// character-display.tsx
import React from 'react';
import Typography from '@mui/material/Typography';
import { Character } from '../../models/character/character';

interface CharacterDisplayProps {
    character: Character;
}

export default function CharacterDisplay({ character }: CharacterDisplayProps) {
    return (
        <div>
            <Typography variant="h3" align="left" gutterBottom>
                {character.name}
            </Typography>

            <Typography variant="h4" align="left" gutterBottom>
                Level: {character.levels.length}
            </Typography>

            <Typography variant="h5" align="left">
                Race: {character.subrace?.name ?? character.race?.name}
            </Typography>

            <Typography variant="h5" align="left">
                Background: {character.background?.name}
            </Typography>

            {character.levels.length > 0 &&
                character.getClasses().map((cls) => (
                    <li>
                        {cls.class} {`(${cls.levels})`}
                    </li>
                ))}

            {character.baseAbilityScores && (
                <div>
                    <Typography variant="h6" align="left" gutterBottom>
                        Ability Scores:
                    </Typography>
                    {Object.entries(character.getTotalAbilityScores()).map(
                        ([key, value]) => (
                            <Typography key={key} variant="body1" align="left">
                                {key}: {value}
                            </Typography>
                        ),
                    )}
                </div>
            )}
        </div>
    );
}
