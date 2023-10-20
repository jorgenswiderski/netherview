import { Character } from '../../../models/character/character';

export type SettingsMenuOption = {
    label: string;
    onClick: (character: Character) => Character;
    disabled?: (character: Character) => boolean;
    hidden?: (character: Character) => boolean;
};

export const settingsMenuOptions: SettingsMenuOption[] = [
    // {
    //     label: 'Remove a level in a class',
    //     onClick: (char) => char.startRemoveLevel(),
    // },
    {
        label: 'Manage levels...',
        onClick: (char) => char.manageLevels(),
    },
];
