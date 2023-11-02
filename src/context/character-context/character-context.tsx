import React, {
    useContext,
    useMemo,
    useState,
    useEffect,
    ReactNode,
} from 'react';
import { CircularProgress, Box } from '@mui/material';
import { Build } from '@jorgenswiderski/tomekeeper-shared/dist/types/builds';
import { CharacterContext, CharacterContextType } from './types';
import { useGameData } from '../game-data-context/game-data-context';
import { Character } from '../../models/character/character';

interface CharacterProviderProps {
    children: ReactNode;
}

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
