import React, { useState } from 'react';
import {
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Box,
    DialogActions,
    Button,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { CookieConsentDialog } from './cookie-consent-dialog';

interface AppSettingsDialogProps {
    open: boolean;
    onClose: () => void;
}

export function AppSettingsDialog({ open, onClose }: AppSettingsDialogProps) {
    const [cookies, setCookies] = useState(false);

    return (
        <>
            <Dialog open={open} onClose={onClose}>
                <DialogTitle>App Settings</DialogTitle>
                <DialogContent>
                    <Box
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: '300px',
                        }}
                    >
                        <Typography>Cookie Settings</Typography>
                        <IconButton onClick={() => setCookies(true)}>
                            <SettingsIcon />
                        </IconButton>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
            <CookieConsentDialog
                open={cookies}
                onComplete={() => setCookies(false)}
            />
        </>
    );
}
