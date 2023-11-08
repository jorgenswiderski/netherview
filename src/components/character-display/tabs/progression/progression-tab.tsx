import React, { useMemo } from 'react';
import { useCharacter } from '../../../../context/character-context/character-context';
import { TabPanel } from '../../../simple-tabs/tab-panel';
import { TabPanelProps } from '../../../simple-tabs/types';
import { ProgressionLevelPanel } from './progression-level-panel';

interface ProgressionTabProps extends TabPanelProps {}

export function ProgressionTab({ ...panelProps }: ProgressionTabProps) {
    const { character } = useCharacter();

    const levelInfo = useMemo(() => {
        const info = character.getClassInfo();

        return info.flatMap((level) => level.levels);
    }, [character]);

    return (
        <TabPanel {...panelProps}>
            {levelInfo.map((info, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <ProgressionLevelPanel key={index} levelInfo={info} />
            ))}
        </TabPanel>
    );
}
