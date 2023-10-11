import React, { useMemo } from 'react';
import Typography from '@mui/material/Typography';
import { Character } from '../../models/character/character';
import GrantedEffect from './granted-effect';

interface CharacterDisplayProps {
    character: Character;
}

export default function CharacterDisplay({ character }: CharacterDisplayProps) {
    const actions = useMemo(() => character.getActions(), [character]);
    const characteristics = useMemo(
        () => character.getCharacteristics(),
        [character],
    );
    const proficiencies = useMemo(
        () => character.getProficiencies(),
        [character],
    );

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
                    <li key={`${cls.class}-${cls.levels}`}>
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

            {actions.length > 0 && (
                <div>
                    <Typography variant="h6" align="left" gutterBottom>
                        Actions:
                    </Typography>
                    {actions.map((action) => (
                        <GrantedEffect effect={action} />
                    ))}
                </div>
            )}

            {characteristics.length > 0 && (
                <div>
                    <Typography variant="h6" align="left" gutterBottom>
                        Characteristics:
                    </Typography>
                    {characteristics.map((char) => (
                        <GrantedEffect effect={char} />
                    ))}
                </div>
            )}

            {proficiencies.length > 0 && (
                <div>
                    <Typography variant="h6" align="left" gutterBottom>
                        Proficiencies:
                    </Typography>
                    {proficiencies.map((proficiency) => (
                        <GrantedEffect effect={proficiency} />
                    ))}
                </div>
            )}
        </div>
    );
}
