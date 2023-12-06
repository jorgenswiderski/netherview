import React, {
    useContext,
    useMemo,
    useState,
    useEffect,
    ReactNode,
    useCallback,
} from 'react';
import { CircularProgress, Box } from '@mui/material';
import { Build } from '@jorgenswiderski/tomekeeper-shared/dist/types/builds';
import { CharacterContext, CharacterContextType } from './types';
import { useGameData } from '../game-data-context/game-data-context';
import { Character } from '../../models/character/character';
import { CONFIG } from '../../models/config';

interface CharacterProviderProps {
    children: ReactNode;
}

export function CharacterProvider({ children }: CharacterProviderProps) {
    const [build, setBuild] = useState<Build>();

    // Initialization =========================================================
    const { classData, spellData } = useGameData();
    const [character, setCharacter] = useState<Character>();

    useEffect(() => {
        if (!character && classData && spellData) {
            setCharacter(new Character(classData, spellData));
        }
    }, [classData, spellData, character]);

    // Undo History ===========================================================
    const [history, setHistory] = useState<Character[]>([]);
    const [decisions, setDecisions] = useState<(string | undefined)[]>([]);

    useEffect(() => {
        async function saveSnapshot() {
            if (
                character &&
                character.pendingDecisions[0]?.id !==
                    decisions[decisions.length - 1]
            ) {
                const char = await character.snapshot();

                setHistory((prevHistory) => {
                    const h = [...prevHistory, char];

                    return h.length > CONFIG.UNDO_LIMIT ? h.slice(1) : h;
                });

                setDecisions((prevDec) => {
                    const d = [...prevDec, character.pendingDecisions[0]?.id];

                    return d.length > CONFIG.UNDO_LIMIT ? d.slice(1) : d;
                });
            }
        }

        saveSnapshot();
    }, [character?.pendingDecisions[0]]);

    const canUndo = useMemo(
        () =>
            !!history.findLast(
                (char) =>
                    char.pendingDecisions[0]?.id !==
                    character?.pendingDecisions[0]?.id,
            ),
        [history, character],
    );

    const undo = useCallback(() => {
        const snapshot = history.findLast(
            (char) =>
                char.pendingDecisions[0]?.id !==
                character?.pendingDecisions[0]?.id,
        );

        if (snapshot) {
            const index = history.indexOf(snapshot);

            setHistory((prev) => prev.slice(0, index));
            setDecisions((prev) => prev.slice(0, index));
            setCharacter(snapshot);
        }
    }, [history]);

    const resetHistory = () => setHistory([]);

    // Context Initialization =================================================
    const contextValue = useMemo(
        () => ({
            build,
            setBuild,
            character: character!,
            setCharacter,
            undo,
            canUndo,
            resetHistory,
        }),
        [build, setBuild, character, setCharacter, undo, canUndo, resetHistory],
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
