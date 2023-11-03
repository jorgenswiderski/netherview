import React, { useState, useMemo } from 'react';
import ShareIcon from '@mui/icons-material/Share';
import SaveIcon from '@mui/icons-material/Save';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import { Box, IconButton, Paper, Tooltip, Typography } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { WeaveApi } from '../../api/weave/weave';
import { useCharacter } from '../../context/character-context/character-context';
import { CONFIG } from '../../models/config';
import { useNotification } from '../../context/notification-context/notification-context';
import { PACKAGE_VERSION } from '../../../version';

export function ShareButton() {
    const { character, setBuild, build } = useCharacter();
    const { showNotification } = useNotification();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [sharedUrl, setSharedUrl] = useState('');

    const disabled = useMemo(() => !character.canExport(), [character]);

    const tooltipText = useMemo(() => {
        if (disabled) {
            return `Can't ${
                build?.id ? 'share' : 'save'
            } build while editing the character in the right panel`;
        }

        return build?.id ? 'Update shared build' : 'Share';
    }, [build?.id, disabled]);

    if (build?.id && !build.mayEdit) {
        return null;
    }

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
    };

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(sharedUrl);
        showNotification('Link copied to clipboard!');
    };

    const handleShareOrUpdate = async () => {
        try {
            if (!character.canExport()) {
                return;
            }

            const encodedData = await character.export(true);

            let buildId;

            if (build?.id) {
                await WeaveApi.builds.update(
                    build.id,
                    encodedData,
                    PACKAGE_VERSION,
                );

                buildId = build.id;
                showNotification('Shared build updated successfully!');
            } else {
                buildId = await WeaveApi.builds.create(
                    encodedData,
                    PACKAGE_VERSION,
                );

                const url = `${CONFIG.BASE_URL}/share/${buildId}`;
                setSharedUrl(url);
                setIsDialogOpen(true);
            }

            setBuild({
                id: buildId,
                encoded: encodedData,
                version: PACKAGE_VERSION,
                mayEdit: true,
            });
        } catch (err) {
            showNotification('An unexpected error occurred');
        }
    };

    return (
        <>
            <Tooltip title={tooltipText}>
                {/* Wrap in span so tooltip doesn't get disabled */}
                <span>
                    <IconButton
                        onClick={handleShareOrUpdate}
                        disabled={disabled}
                    >
                        {build?.id ? <SaveIcon /> : <ShareIcon />}
                    </IconButton>
                </span>
            </Tooltip>

            {isDialogOpen && (
                <Dialog
                    open={isDialogOpen}
                    onClose={handleCloseDialog}
                    fullWidth
                >
                    <DialogTitle>Share your Build</DialogTitle>
                    <DialogContent sx={{ minWidth: 500, padding: 3 }}>
                        <Paper elevation={2} sx={{ padding: '1rem' }}>
                            <Typography
                                variant="body2"
                                sx={{ marginBottom: 2 }}
                            >
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
                                <InfoIcon
                                    color="info"
                                    sx={{ marginRight: 1 }}
                                />
                                <Typography variant="body2">
                                    You can update the shared build at any time
                                    by clicking the &quot;Save&quot; button.
                                </Typography>
                            </Box>
                        </Paper>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCopyToClipboard}>Copy</Button>
                        <Button onClick={handleCloseDialog}>Close</Button>
                    </DialogActions>
                </Dialog>
            )}
        </>
    );
}
