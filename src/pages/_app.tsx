/* eslint-disable react/jsx-props-no-spreading */
// _app.tsx
import React, { useEffect } from 'react';
import '../styles/global.css';
import { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import { useRouter } from 'next/router';
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
import { NotificationProvider } from '../context/notification-context/notification-context';
import * as analytics from '../models/google-analytics';
import '../models/hotjar';

initCharacterTreeActionEffectRef();
initCharacterTreeSpellEffectRef();
initCharacterTreeActionCompressor();

function MyApp({ Component, pageProps }: AppProps) {
    const router = useRouter();

    useEffect(() => {
        // Initialize Google Analytics
        analytics.initGA();

        // Log initial page view
        analytics.logPageView();

        // Log page view on route change
        router.events.on('routeChangeComplete', analytics.logPageView);

        return () => {
            router.events.off('routeChangeComplete', analytics.logPageView);
        };
    }, [router.events]);

    return (
        <ThemeProvider theme={theme}>
            <GameDataProvider>
                <CharacterProvider>
                    <NotificationProvider>
                        <Component {...pageProps} />
                    </NotificationProvider>
                </CharacterProvider>
            </GameDataProvider>
        </ThemeProvider>
    );
}

export default MyApp;
