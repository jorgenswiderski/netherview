import React from 'react';
import { Paper, Typography } from '@mui/material';
import { Character } from '../../models/character/character';
import AbilityScoresTable from './ability-scores';
import { CharacterEffects } from './character-effects';
import { CharacterHeader } from './character-header';
import CharacterItems from './character-items';

interface CharacterDisplayProps {
    character: Character;
}

export default function CharacterDisplay({ character }: CharacterDisplayProps) {
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
                    {character.baseAbilityScores && (
                        <AbilityScoresTable
                            abilityScores={character.getTotalAbilityScores()}
                        />
                    )}

                    {/* Background */}
                    <Paper elevation={2} style={{ padding: '1rem' }}>
                        <Typography variant="h6">
                            Background: {character.background?.name}
                        </Typography>
                    </Paper>

                    {/* Equipped Items */}
                    <Paper elevation={2} style={{ padding: '1rem' }}>
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
