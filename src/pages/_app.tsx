/* eslint-disable react/jsx-props-no-spreading */
// _app.tsx
import React from 'react';
import '../styles/global.css';
import { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material'; // FIXME: Not tree shakeable
import { theme } from '../models/theme';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ThemeProvider theme={theme}>
            <Component {...pageProps} />
        </ThemeProvider>
    );
}

export default MyApp;
