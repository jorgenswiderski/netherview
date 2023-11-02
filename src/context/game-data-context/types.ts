import { ISpell } from '@jorgenswiderski/tomekeeper-shared/dist/types/action';
import { createContext } from 'react';
import { CharacterClassOption } from '../../models/character/types';

export interface GameDataContextType {
    classData?: CharacterClassOption[];
    spellData?: ISpell[];
}

export const GameDataContext = createContext<GameDataContextType | undefined>(
    undefined,
);
