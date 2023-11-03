// settings-menu.tsx
import React, { useState } from 'react';
import { IconButton, Menu } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { ManageLevelsMenuItem } from './menu-items/manage-levels-menu-item';
import { AboutMenuItem } from './menu-items/about-menu-item';
import { SettingsMenuItem } from './menu-items/settings-menu-item';
import { AppSettingsDialog } from '../../app-settings-dialog';

export default function SettingsMenu({ ...props }) {
    const [showAppSettings, setShowAppSettings] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <IconButton onClick={handleClick} {...props}>
                <SettingsIcon />
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <ManageLevelsMenuItem handleClose={handleClose} />
                <SettingsMenuItem
                    handleClose={() => {
                        setShowAppSettings(true);
                        handleClose();
                    }}
                />
                <AboutMenuItem handleClose={handleClose} />
            </Menu>

            <AppSettingsDialog
                open={showAppSettings}
                onClose={() => setShowAppSettings(false)}
            />
        </>
    );
}
