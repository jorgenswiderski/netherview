// options.tsx
import { WeaveApi } from '../../../api/weave/weave';
import { Character } from '../../../models/character/character';
import { log } from '../../../models/logger';

export type SettingsMenuOption = {
    label: string;
    onClick: (character: Character) => Promise<Character>;
    disabled?: (character: Character) => boolean;
    hidden?: (character: Character) => boolean;
};

export const settingsMenuOptions: SettingsMenuOption[] = [
    {
        label: 'Manage levels...',
        onClick: async (char) => char.manageLevels(),
    },
    {
        label: 'Share',
        disabled: (char) => !char.canExport(),
        onClick: async (char) => {
            const encodedData = await char.export();
            const buildVersion = '1.0.0'; // FIXME

            // test the export
            await Character.import(
                encodedData,
                char.baseClassData,
                char.spellData,
            );

            const buildId = await WeaveApi.builds.create(
                encodedData,
                buildVersion,
            );

            log(`Build saved with id=${buildId}`);

            return char;
        },
    },
];
