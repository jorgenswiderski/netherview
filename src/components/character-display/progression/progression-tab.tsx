import React, { useMemo } from 'react';
import styled from '@emotion/styled';
import { Paper } from '@mui/material';
import { useCharacter } from '../../../context/character-context/character-context';
import { TabPanel } from '../../simple-tabs/tab-panel';
import { TabPanelProps } from '../../simple-tabs/types';
import { LevelCollapsible } from '../../level-manager/level-collapsible';
import { TabPanelItem } from '../../simple-tabs/tab-panel-item';

const StyledTabPanel = styled(TabPanel)`
    padding: 1rem;
    box-sizing: border-box;
`;

const StyledTabPanelItem = styled(TabPanelItem)`
    break-inside: auto;
    padding: 0;

    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

interface ProgressionTabProps extends TabPanelProps {}

export function ProgressionTab({ ...panelProps }: ProgressionTabProps) {
    const { character } = useCharacter();

    const levelInfo = useMemo(() => {
        const info = character.getClassInfo();

        return info.flatMap((level) => level.levels);
    }, [character]);

    return (
        <StyledTabPanel
            {...panelProps}
            component={Paper}
            componentProps={{ elevation: 2 }}
        >
            <StyledTabPanelItem>
                {levelInfo.map((info, index) => (
                    <LevelCollapsible
                        name={info.node.name}
                        effects={info.totalEffects}
                        level={index + 1}
                        onDelete={() => {}}
                        onHoverDelete={() => {}}
                    />
                ))}
            </StyledTabPanelItem>
        </StyledTabPanel>
    );
}
