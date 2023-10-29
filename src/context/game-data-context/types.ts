import { ReactNode, createContext } from 'react';
import { ISpell } from 'planner-types/src/types/action';
import { CharacterClassOption } from '../../models/character/types';

export interface GameDataContextType {
    classData?: CharacterClassOption[];
    spellData?: ISpell[];
}

export const GameDataContext = createContext<GameDataContextType | undefined>(
    undefined,
);

export interface GameDataProviderProps {
    children: ReactNode;
}
