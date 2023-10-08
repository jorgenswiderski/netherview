// _app.tsx
import React from 'react';
import '../styles/global.css';
import { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Component {...pageProps} />;
}

export default MyApp;
