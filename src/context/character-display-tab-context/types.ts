import { createContext } from 'react';

export interface CharacterDisplayTabContextType {
    tabIndex: number;
    setTabIndex: (index: number) => void;
}

export const CharacterDisplayTabContext = createContext<
    CharacterDisplayTabContextType | undefined
>(undefined);
