import React, { useState } from 'react';
import InfoIcon from '@mui/icons-material/Info';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { Typography, Card, CardContent, Link } from '@mui/material';
import BaseMenuItem from '../base-menu-item';
import { CONFIG } from '../../../../models/config';
import { PACKAGE_VERSION } from '../../../../../version';

interface AboutMenuItemProps {
    handleClose: () => void;
}

export function AboutMenuItem({ handleClose }: AboutMenuItemProps) {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
        handleClose();
    };

    const handleCloseDialog = () => {
        setOpen(false);
    };

    return (
        <div>
            <BaseMenuItem
                handleClose={handleClose}
                label="About"
                onClick={handleClickOpen}
                icon={<InfoIcon />}
            />
            <Dialog
                open={open}
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    About {CONFIG.APP_NAME} v{PACKAGE_VERSION}
                </DialogTitle>
                <DialogContent>
                    <Card variant="outlined" sx={{ mb: 2 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Contact & Support
                            </Typography>
                            <Typography variant="body1" paragraph>
                                Have questions, comments, or found a bug? Join
                                the discord:{' '}
                                <Link
                                    href="https://discord.gg/fakelink"
                                    target="_blank"
                                >
                                    discord.gg/fakelink
                                </Link>
                            </Typography>
                        </CardContent>
                    </Card>

                    <Card variant="outlined" sx={{ mb: 2 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Seeking Employment
                            </Typography>
                            <Typography variant="body1" paragraph>
                                I&apos;m currently seeking employment
                                opportunities! Check out my{' '}
                                <Link
                                    href="https://github.com/jorgenswiderski"
                                    target="_blank"
                                >
                                    GitHub
                                </Link>{' '}
                                or connect with me on{' '}
                                <Link
                                    href="https://www.linkedin.com/in/jorgen-swiderski-15579814b"
                                    target="_blank"
                                >
                                    LinkedIn
                                </Link>
                                !
                            </Typography>
                        </CardContent>
                    </Card>

                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Content Attribution
                            </Typography>
                            <Typography variant="body1" paragraph>
                                The content used in this application is sourced
                                from{' '}
                                <Link href="https://bg3.wiki/" target="_blank">
                                    bg3.wiki
                                </Link>
                                , which is licensed under a{' '}
                                <Link
                                    href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
                                    target="_blank"
                                >
                                    CC BY-NC-SA 4.0
                                </Link>{' '}
                                license.
                            </Typography>
                        </CardContent>
                    </Card>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
