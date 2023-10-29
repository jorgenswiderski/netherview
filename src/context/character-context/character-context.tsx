import React, { useContext, useMemo, useState, useEffect } from 'react';
import { CircularProgress, Box } from '@mui/material'; // Import CircularProgress for loading spinner
import { Build } from 'planner-types/src/types/builds';
import {
    CharacterProviderProps,
    CharacterContext,
    CharacterContextType,
} from './types';
import { useGameData } from '../game-data-context/game-data-context';
import { Character } from '../../models/character/character';

export function CharacterProvider({ children }: CharacterProviderProps) {
    const { classData, spellData } = useGameData();
    const [build, setBuild] = useState<Build>();
    const [character, setCharacter] = useState<Character>();

    useEffect(() => {
        if (!character && classData && spellData) {
            setCharacter(new Character(classData, spellData));
        }
    }, [classData, spellData, character]);

    const contextValue = useMemo(
        () => ({ build, setBuild, character: character!, setCharacter }),
        [build, setBuild, character, setCharacter],
    );

    if (!character) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <CharacterContext.Provider value={contextValue}>
            {children}
        </CharacterContext.Provider>
    );
}

export const useCharacter = (): CharacterContextType => {
    const context = useContext(CharacterContext);

    if (context === undefined) {
        throw new Error('useCharacter must be used within a CharacterProvider');
    }

    return context;
};
