// settings-menu.tsx
import React, { useState } from 'react';
import { IconButton, Menu } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { ShareMenuItem } from './menu-items/share-menu-item';
import { ManageLevelsMenuItem } from './menu-items/manage-levels-menu-item';

export default function SettingsMenu() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <IconButton onClick={handleClick}>
                <SettingsIcon />
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <ShareMenuItem handleClose={handleClose} />
                <ManageLevelsMenuItem handleClose={handleClose} />
            </Menu>
        </>
    );
}
