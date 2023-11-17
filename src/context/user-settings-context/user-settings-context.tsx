// user-settings-context.tsx
import React, {
    useContext,
    useState,
    ReactNode,
    useEffect,
    useMemo,
} from 'react';
import { useRouter } from 'next/router';
import { SettingsContext, SettingsContextType, UserSettings } from './types';
import { WelcomeDialog } from '../../components/welcome-dialog';
import { CookieConsentDialog } from '../../components/cookie-consent-dialog';
import { HotjarService } from '../../models/hotjar';
import { GoogleAnalytics } from '../../models/google-analytics';
import { SentryService } from '../../models/sentry-service';
import { CONFIG } from '../../models/config';

enum DialogStates {
    WELCOME,
    COOKIES,
    DONE,
}

interface SettingsProviderProps {
    children: ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps) {
    const router = useRouter();

    const getState = (): DialogStates => {
        const welcomed = localStorage.getItem('welcomed');

        if (!welcomed) {
            return DialogStates.WELCOME;
        }

        const consented = localStorage.getItem('nonNecessaryCookies');

        if (!consented) {
            return DialogStates.COOKIES;
        }

        return DialogStates.DONE;
    };

    const [state, setState] = useState<DialogStates>(getState);

    const [settings, setSettings] = useState<Partial<UserSettings>>();

    // eslint-disable-next-line consistent-return
    useEffect(() => {
        if (CONFIG.IS_DEV) {
            return;
        }

        if (settings?.allowNonNecessaryCookies) {
            HotjarService.enable();
            SentryService.enable();

            // Initialize Google Analytics
            const mustLog = !GoogleAnalytics.enabled;

            GoogleAnalytics.enable();

            if (mustLog) {
                GoogleAnalytics.logPageView();
            }

            router.events.on(
                'routeChangeComplete',
                GoogleAnalytics.logPageView.bind(GoogleAnalytics),
            );

            // eslint-disable-next-line consistent-return
            return () => {
                router.events.off(
                    'routeChangeComplete',
                    GoogleAnalytics.logPageView.bind(GoogleAnalytics),
                );
            };
            // eslint-disable-next-line no-else-return
        } else {
            HotjarService.disable();
            GoogleAnalytics.disable();
            SentryService.disable();
        }
    }, [router.events, settings?.allowNonNecessaryCookies]);

    const updateState = (): void => {
        setState(getState());

        setSettings({
            allowNonNecessaryCookies:
                localStorage.getItem('nonNecessaryCookies') === 'true',
            welcomed: localStorage.getItem('welcomed') === 'true',
            debugMode:
                CONFIG.IS_DEV || localStorage.getItem('debugMode') === 'true',
        });
    };

    const contextValue = useMemo(
        () => ({ ...settings, updateSettingsState: updateState }),
        [settings, updateState],
    ) as UserSettings;

    useEffect(() => updateState(), []);

    if (state === DialogStates.WELCOME) {
        return <WelcomeDialog onComplete={updateState} />;
    }

    if (state === DialogStates.COOKIES) {
        return <CookieConsentDialog onComplete={updateState} onboarding />;
    }

    return (
        <SettingsContext.Provider value={contextValue}>
            {children}
        </SettingsContext.Provider>
    );
}

export const useSettings = (): SettingsContextType => {
    const context = useContext(SettingsContext);

    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }

    return context;
};
