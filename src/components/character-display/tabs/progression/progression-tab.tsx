import React, { useMemo } from 'react';
import { useCharacter } from '../../../../context/character-context/character-context';
import { TabPanel } from '../../../simple-tabs/tab-panel';
import { TabPanelProps } from '../../../simple-tabs/types';
import { ProgressionLevelPanel } from './progression-level-panel';

interface ProgressionTabProps extends TabPanelProps {}

export function ProgressionTab({ ...panelProps }: ProgressionTabProps) {
    const { character } = useCharacter();

    const classInfo = useMemo(() => character.getClassInfo(), [character]);

    const levelInfo = useMemo(
        () => classInfo.flatMap((level) => level.levels),
        [classInfo],
    );

    return (
        <TabPanel {...panelProps}>
            {levelInfo.map((info, index) => (
                <ProgressionLevelPanel
                    // eslint-disable-next-line react/no-array-index-key
                    key={index}
                    levelInfo={info}
                    multiclassed={classInfo.length > 1}
                />
            ))}
        </TabPanel>
    );
}
