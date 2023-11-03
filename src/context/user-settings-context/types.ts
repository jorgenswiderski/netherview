import { createContext } from 'react';

export interface UserSettings {
    allowNonNecessaryCookies: boolean;
    welcomed: boolean;
    debugMode: boolean;

    updateSettingsState: () => void;
}

export interface SettingsContextType extends UserSettings {}

export const SettingsContext = createContext<SettingsContextType | undefined>(
    undefined,
);
