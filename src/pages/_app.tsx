/* eslint-disable react/jsx-props-no-spreading */
// _app.tsx
import React from 'react';
import '../styles/global.css';
import { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../models/theme';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { CharacterProvider } from '../context/character-context/character-context';
import { GameDataProvider } from '../context/game-data-context/game-data-context';
import { initCharacterTreeActionCompressor } from '../models/character/character-tree-node/character-tree-action';
import { initCharacterTreeActionEffectRef } from '../models/character/character-tree-node/character-tree-action-effect';
import { initCharacterTreeSpellEffectRef } from '../models/character/character-tree-node/character-tree-spell-effect';

initCharacterTreeActionEffectRef();
initCharacterTreeSpellEffectRef();
initCharacterTreeActionCompressor();

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ThemeProvider theme={theme}>
            <GameDataProvider>
                <CharacterProvider>
                    <Component {...pageProps} />
                </CharacterProvider>
            </GameDataProvider>
        </ThemeProvider>
    );
}

export default MyApp;
