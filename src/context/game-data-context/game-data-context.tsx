import React, {
    useContext,
    useEffect,
    useState,
    useMemo,
    ReactNode,
} from 'react';
import { ISpell } from '@jorgenswiderski/tomekeeper-shared/dist/types/action';
import { GameDataContext, GameDataContextType } from './types';
import { WeaveApi } from '../../api/weave/weave';
import { CharacterClassOption } from '../../models/character/types';

interface GameDataProviderProps {
    children: ReactNode;
}

export function GameDataProvider({ children }: GameDataProviderProps) {
    const [classData, setClassData] = useState<CharacterClassOption[]>();
    const [spellData, setSpellData] = useState<ISpell[]>();

    useEffect(() => {
        // FIXME
        WeaveApi.classes.getClassesInfo().then(setClassData);
        WeaveApi.spells.get().then(setSpellData);
    }, []);

    const contextValue = useMemo(
        () => ({ classData, spellData }),
        [classData, spellData],
    );

    return (
        <GameDataContext.Provider value={contextValue}>
            {children}
        </GameDataContext.Provider>
    );
}

export const useGameData = (): GameDataContextType => {
    const context = useContext(GameDataContext);

    if (context === undefined) {
        throw new Error('useGameData must be used within a GameDataProvider');
    }

    return context;
};
