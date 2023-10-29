import { Build } from 'planner-types/src/types/builds';
import { ReactNode, createContext } from 'react';
import { Character } from '../../models/character/character';

export interface CharacterContextType {
    build?: Build;
    setBuild: (data: Build) => void;
    character: Character;
    setCharacter: (character: Character) => void;
}

export const CharacterContext = createContext<CharacterContextType | undefined>(
    undefined,
);

export interface CharacterProviderProps {
    children: ReactNode;
}
