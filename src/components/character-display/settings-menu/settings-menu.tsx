import React, { useState } from 'react';
import {
    IconButton,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { Character } from '../../../models/character/character';
import { settingsMenuOptions } from './options';

interface SettingsMenuProps {
    character: Character;
    updateCharacter: (character: Character) => void;
}

export default function SettingsMenu({
    character,
    updateCharacter,
}: SettingsMenuProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMenuItemClick = (label: string) => {
        const newCharacter = settingsMenuOptions
            .find((option) => option.label === label)!
            .onClick(character);

        updateCharacter(newCharacter);
        handleClose();
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
                {settingsMenuOptions
                    .filter(
                        (option) =>
                            typeof option.hidden === 'undefined' ||
                            !option.hidden(character),
                    )
                    .map((option) => (
                        <MenuItem
                            key={option.label}
                            onClick={() => handleMenuItemClick(option.label)}
                            disabled={
                                option.disabled && option.disabled(character)
                            }
                        >
                            <ListItemIcon>
                                {/* You can add an icon here if you wish */}
                            </ListItemIcon>
                            <ListItemText primary={option.label} />
                        </MenuItem>
                    ))}
            </Menu>
        </>
    );
}
