import React, { ReactNode } from 'react';
import {
    Card,
    CardActionArea,
    CardContent,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    Grid,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { CONFIG } from '../models/config';

const options: { description: ReactNode; value: 'true' | 'false' }[] = [
    {
        description: (
            <>
                <CheckIcon />
                {`Yes, allow telemetry and cookies for purposes related
                exclusively to improving ${CONFIG.APP_NAME}.`}
            </>
        ),
        value: 'true',
    },
    {
        description: (
            <>
                <CloseIcon />
                {`Allow only strictly necessary cookies for using ${CONFIG.APP_NAME}.`}
            </>
        ),
        value: 'false',
    },
];

interface CookieConsentDialogProps {
    open?: boolean;
    onboarding?: boolean;
    onComplete: () => void;
}

export function CookieConsentDialog({
    open = true,
    onboarding = false,
    onComplete,
}: CookieConsentDialogProps) {
    const setAllowCookies = (value: 'true' | 'false'): void => {
        localStorage.setItem('nonNecessaryCookies', value);
        onComplete();
    };

    return (
        <Dialog open={open}>
            <DialogTitle>Cookie Consent</DialogTitle>
            <DialogContent>
                <Typography paragraph>Choose an option:</Typography>
                <Grid container spacing={2} mb={2}>
                    {options.map(({ description, value }) => (
                        <Grid item xs={12} key={value}>
                            <Card variant="outlined">
                                <CardActionArea
                                    onClick={() => setAllowCookies(value)}
                                >
                                    <CardContent>
                                        <Typography
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '1rem',
                                            }}
                                        >
                                            {description}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
                {onboarding && (
                    <Typography>
                        You can change this later in app settings.
                    </Typography>
                )}
            </DialogContent>
        </Dialog>
    );
}
