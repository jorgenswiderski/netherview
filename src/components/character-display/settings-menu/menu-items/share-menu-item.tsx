import React, { useState, useMemo } from 'react';
import ShareIcon from '@mui/icons-material/Share';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import { Box, Paper, Typography } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import Snackbar from '@mui/material/Snackbar';
import { WeaveApi } from '../../../../api/weave/weave';
import { Character } from '../../../../models/character/character';
import BaseMenuItem from '../base-menu-item';
import { useCharacter } from '../../../../context/character-context/character-context';
import { CONFIG } from '../../../../models/config';

interface ShareMenuItemProps {
    handleClose: () => void;
}

export function ShareMenuItem({
    handleClose: handleCloseMenu,
}: ShareMenuItemProps) {
    const { character, setBuild } = useCharacter();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [sharedUrl, setSharedUrl] = useState('');
    const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
    };

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(sharedUrl);
        setIsSnackbarOpen(true);
    };

    const onClick = async () => {
        if (!character.canExport()) {
            return;
        }

        const encodedData = await character.export();
        const buildVersion = '1.0.0'; // FIXME

        await Character.import(
            encodedData,
            character.baseClassData,
            character.spellData,
        );

        const buildId = await WeaveApi.builds.create(encodedData, buildVersion);
        setBuild({ id: buildId, encoded: encodedData, version: buildVersion });

        const url = `${CONFIG.BASE_URL}/share/${buildId}`;
        setSharedUrl(url);
        setIsDialogOpen(true);
        handleCloseMenu();
    };

    const disabled = useMemo(() => !character.canExport(), [character]);

    return (
        <>
            <BaseMenuItem
                handleClose={handleCloseMenu}
                label="Share"
                onClick={onClick}
                disabled={disabled}
                icon={<ShareIcon />}
            />
            <Dialog open={isDialogOpen} onClose={handleCloseDialog} fullWidth>
                <DialogTitle>Share your Build</DialogTitle>
                <DialogContent sx={{ minWidth: 500, padding: 3 }}>
                    <Paper elevation={2} sx={{ padding: '1rem' }}>
                        <Typography variant="body2" sx={{ marginBottom: 2 }}>
                            Use the link below to share your character build
                            with others!
                        </Typography>
                        <Paper elevation={3} sx={{ marginBottom: 2 }}>
                            <Input
                                value={sharedUrl}
                                fullWidth
                                readOnly
                                sx={{ fontSize: '0.875rem' }}
                                onClick={handleCopyToClipboard}
                            />
                        </Paper>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <InfoIcon color="info" sx={{ marginRight: 1 }} />
                            <Typography variant="body2">
                                You can update the shared build at any time by
                                selecting the &quot;Save&quot; option from the
                                menu.
                            </Typography>
                        </Box>
                    </Paper>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCopyToClipboard}>Copy</Button>
                    <Button onClick={handleCloseDialog}>Close</Button>
                </DialogActions>

                <Snackbar
                    open={isSnackbarOpen}
                    autoHideDuration={5000}
                    onClose={(event, reason) => {
                        if (reason === 'clickaway') {
                            return;
                        }

                        setIsSnackbarOpen(false);
                    }}
                    message="Link copied to clipboard!"
                />
            </Dialog>
        </>
    );
}
