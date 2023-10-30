import React, { useState } from 'react';
import InfoIcon from '@mui/icons-material/Info';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import { Typography } from '@mui/material';
import Link from 'next/link';
import styled from '@emotion/styled';
import BaseMenuItem from '../base-menu-item';
import { CONFIG } from '../../../../models/config';
import { PACKAGE_VERSION } from '../../../../../version';

const StyledLink = styled(Link)`
    color: lightblue;
`;

interface AboutMenuItemProps {
    handleClose: () => void;
}

export function AboutMenuItem({ handleClose }: AboutMenuItemProps) {
    const [open, setOpen] = useState(false);
    const theme = useTheme();

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
            <Dialog open={open} onClose={handleCloseDialog}>
                <DialogTitle>About {CONFIG.APP_NAME}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <span style={{ fontWeight: 700 }}>Version:</span>{' '}
                        {PACKAGE_VERSION}
                    </DialogContentText>
                    <DialogContentText mt={2}>
                        Have questions, comments, or a bug report? Join the
                        discord:{' '}
                        <StyledLink
                            target="_blank"
                            href="https://discord.gg/fakelink"
                        >
                            discord.gg/fakelink
                        </StyledLink>
                    </DialogContentText>
                    <Typography mt={2}>Content Attribution</Typography>
                    <DialogContentText>
                        The content used in this application is sourced from{' '}
                        <StyledLink target="_blank" href="https://bg3.wiki/">
                            bg3.wiki
                        </StyledLink>
                        , which is licensed under a{' '}
                        <StyledLink
                            target="_blank"
                            href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
                        >
                            CC BY-NC-SA 4.0
                        </StyledLink>{' '}
                        license.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleCloseDialog}
                        sx={{ color: theme.palette.primary.main }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
