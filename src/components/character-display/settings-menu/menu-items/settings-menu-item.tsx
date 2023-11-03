import React from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import BaseMenuItem from '../base-menu-item';
import { useCharacter } from '../../../../context/character-context/character-context';

interface SettingsMenuItemProps {
    handleClose: () => void;
}

export function SettingsMenuItem({ handleClose }: SettingsMenuItemProps) {
    const { character, setCharacter } = useCharacter();

    const onClick = async () => {
        const newCharacter = await character.manageLevels();
        setCharacter(newCharacter);
    };

    return (
        <BaseMenuItem
            handleClose={handleClose}
            label="App settings"
            onClick={onClick}
            icon={<SettingsIcon />}
        />
    );
}
