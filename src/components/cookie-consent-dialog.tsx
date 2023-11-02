import React from 'react';
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
import { CONFIG } from '../models/config';

const options: { description: string; value: 'true' | 'false' }[] = [
    {
        description: `Allow tracking cookies for purposes related exclusively to improving ${CONFIG.APP_NAME}.`,
        value: 'true',
    },
    {
        description: `Allow only strictly necessary cookies for using ${CONFIG.APP_NAME}.`,
        value: 'false',
    },
];

interface CookieConsentDialogProps {
    open?: boolean;
    onComplete: () => void;
}

export function CookieConsentDialog({
    open = true,
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
                <Grid container spacing={2}>
                    {options.map(({ description, value }) => (
                        <Grid item xs={12} key={value}>
                            <Card variant="outlined">
                                <CardActionArea
                                    onClick={() => setAllowCookies(value)}
                                >
                                    <CardContent>
                                        <Typography>{description}</Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </DialogContent>
        </Dialog>
    );
}
