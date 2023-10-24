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

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ThemeProvider theme={theme}>
            <Component {...pageProps} />
        </ThemeProvider>
    );
}

export default MyApp;
