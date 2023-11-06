import React from 'react';
import Head from 'next/head';
import { CONFIG } from '../models/config';

const title = "Tomekeeper - Character Planner for Baldur's Gate III";

const description =
    "Plan your Baldur's Gate III adventure with our interactive character planner. Craft and share custom builds, select skills, and equip gear to maximize your RPG experience. Start strategizing today!";

export function AppHead() {
    return (
        <Head>
            <title>{title}</title>

            <meta name="description" content={description} />

            {/* Icons */}
            <link
                rel="apple-touch-icon"
                sizes="180x180"
                href="/icon/apple-touch-icon.png"
            />
            <link
                rel="icon"
                type="image/png"
                sizes="32x32"
                href="/icon/favicon-32x32.png"
            />
            <link
                rel="icon"
                type="image/png"
                sizes="16x16"
                href="/icon/favicon-16x16.png"
            />
            <link rel="manifest" href="/site.webmanifest" />

            {/* Other tags for SEO */}
            <meta
                name="viewport"
                content="initial-scale=1.0, width=device-width"
            />

            {/* Open Graph / Social media tags */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content="website" />
            <meta
                property="og:image"
                content={`${CONFIG.BASE_URL}/icon/android-chrome-512x512.png`}
            />
            <meta property="og:url" content={CONFIG.BASE_URL} />

            {/* Twitter Card tags */}
            <meta name="twitter:card" content="summary_large_image" />
            {/* <meta name="twitter:creator" content="@YOUR_TWITTER_HANDLE" />s */}
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta
                name="twitter:image"
                content={`${CONFIG.BASE_URL}/icon/android-chrome-512x512.png`}
            />
        </Head>
    );
}
