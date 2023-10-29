import React, {
    createContext,
    useContext,
    ReactNode,
    useState,
    useMemo,
} from 'react';
import Snackbar from '@mui/material/Snackbar';

interface NotificationContextProps {
    showNotification: (msg: string) => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(
    undefined,
);

export const useNotification = (): NotificationContextProps => {
    const context = useContext(NotificationContext);

    if (!context) {
        throw new Error(
            'useNotification must be used within a NotificationProvider',
        );
    }

    return context;
};

interface NotificationProviderProps {
    children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
    const [message, setMessage] = useState<string | null>(null);

    const showNotification = (msg: string) => {
        setMessage(msg);
    };

    const closeNotification = () => {
        setMessage(null);
    };

    const contextValue = useMemo(
        () => ({ showNotification }),
        [showNotification],
    );

    return (
        <NotificationContext.Provider value={contextValue}>
            {children}
            <Snackbar
                open={message != null}
                autoHideDuration={5000}
                onClose={closeNotification}
                message={message || ''}
            />
        </NotificationContext.Provider>
    );
}
