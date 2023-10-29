import React from 'react';
import LayersIcon from '@mui/icons-material/Layers';
import BaseMenuItem from '../base-menu-item';
import { useCharacter } from '../../../../context/character-context/character-context';

interface ManageLevelsMenuItemProps {
    handleClose: () => void;
}

export function ManageLevelsMenuItem({
    handleClose,
}: ManageLevelsMenuItemProps) {
    const { character, setCharacter } = useCharacter();

    const onClick = async () => {
        const newCharacter = await character.manageLevels();
        setCharacter(newCharacter);
    };

    return (
        <BaseMenuItem
            handleClose={handleClose}
            label="Manage levels..."
            onClick={onClick}
            icon={<LayersIcon />}
        />
    );
}
