import { Build } from '@jorgenswiderski/tomekeeper-shared/dist/types/builds';
import { createContext } from 'react';
import { Character } from '../../models/character/character';

export interface CharacterContextType {
    build?: Build;
    setBuild: (data?: Build) => void;
    character: Character;
    setCharacter: (character: Character) => void;
}

export const CharacterContext = createContext<CharacterContextType | undefined>(
    undefined,
);
