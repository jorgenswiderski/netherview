import { ReactNode, createContext } from 'react';
import { ISpell } from '@jorgenswiderski/tomekeeper-shared/dist/types/action';
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
