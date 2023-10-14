import React, { useMemo } from 'react';
import Paper from '@mui/material/Paper';
import { Character } from '../../models/character/character';
import AbilityScoresTable from './ability-scores';
import { CharacterEffects } from './character-effects';
import { CharacterHeader } from './character-header';
import CharacterItems from './character-items';
import CharacterBackground from './character-background';

interface CharacterDisplayProps {
    character: Character;
}

export default function CharacterDisplay({ character }: CharacterDisplayProps) {
    const abilityScores = useMemo(
        () => character.getTotalAbilityScores(),
        [character],
    );

    const background = useMemo(() => character.getBackground(), [character]);

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                gap: '1rem',
            }}
        >
            {/* Header showing character name, race, and classes */}
            <CharacterHeader character={character} />

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    width: '100%',
                }}
            >
                {/* Left section */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        flex: '1',
                        marginRight: '1rem',
                    }}
                >
                    {/* Ability Scores */}
                    {abilityScores && (
                        <AbilityScoresTable abilityScores={abilityScores} />
                    )}

                    {/* Background */}
                    {background && (
                        <CharacterBackground background={background} />
                    )}

                    {/* Equipped Items */}
                    <Paper elevation={2} style={{ padding: '1rem', flex: 1 }}>
                        <CharacterItems />
                    </Paper>
                </div>

                {/* Right section */}
                <div style={{ flex: '1' }}>
                    <CharacterEffects character={character} />
                </div>
            </div>
        </div>
    );
}
