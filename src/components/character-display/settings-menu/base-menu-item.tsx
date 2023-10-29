import React, { ReactNode } from 'react';
import { MenuItem, ListItemIcon, ListItemText } from '@mui/material';

interface BaseMenuItemProps {
    handleClose: () => void;
    label: string;
    onClick: () => void;
    disabled?: boolean;
    icon?: ReactNode;
}

function BaseMenuItem({
    handleClose,
    label,
    onClick,
    disabled,
    icon,
}: BaseMenuItemProps) {
    const handleClick = async () => {
        handleClose();
        await onClick();
    };

    return (
        <MenuItem onClick={handleClick} disabled={disabled}>
            {icon && <ListItemIcon>{icon}</ListItemIcon>}
            <ListItemText primary={label} />
        </MenuItem>
    );
}

export default BaseMenuItem;
