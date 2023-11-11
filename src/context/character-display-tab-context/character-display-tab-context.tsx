import React, { useContext, useMemo, useState, ReactNode } from 'react';
import {
    CharacterDisplayTabContext,
    CharacterDisplayTabContextType,
} from './types';

interface CharacterDisplayTabProviderProps {
    children: ReactNode;
}

export function CharacterDisplayTabProvider({
    children,
}: CharacterDisplayTabProviderProps) {
    const [tabIndex, setTabIndex] = useState(0);

    const contextValue = useMemo(
        () => ({ tabIndex, setTabIndex }),
        [tabIndex, setTabIndex],
    );

    return (
        <CharacterDisplayTabContext.Provider value={contextValue}>
            {children}
        </CharacterDisplayTabContext.Provider>
    );
}

export const useCharacterDisplayTab = (): CharacterDisplayTabContextType => {
    const context = useContext(CharacterDisplayTabContext);

    if (context === undefined) {
        throw new Error(
            'useCharacterDisplayTab must be used within a CharacterDisplayTabProvider',
        );
    }

    return context;
};
