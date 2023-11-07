import React, { useMemo } from 'react';
import styled from '@emotion/styled';
import { useCharacter } from '../../../context/character-context/character-context';
import { TabPanel } from '../../simple-tabs/tab-panel';
import { TabPanelProps } from '../../simple-tabs/types';
import { LevelCollapsible } from '../../level-manager/level-collapsible';

const ContentSection = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: stretch;
    min-width: 100%;
    gap: 1rem;
    flex: 1;
    overflow-y: hidden;

    @media (max-width: 768px) {
        width: 100%;
        box-sizing: border-box;
        flex-direction: column;
        overflow-y: unset;
    }
`;

const Column = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;

    height: 100%;
    overflow-y: auto;

    flex: 1;

    @media (max-width: 768px) {
        align-items: stretch;
        overflow-y: unset;
    }
`;

interface ProgressionTabProps extends TabPanelProps {}

export function ProgressionTab({ ...panelProps }: ProgressionTabProps) {
    const { character } = useCharacter();

    const levelInfo = useMemo(() => {
        const info = character.getClassInfo();

        return info.flatMap((level) => level.levels);
    }, [character]);

    return (
        <TabPanel {...panelProps}>
            <ContentSection>
                <Column>
                    {levelInfo.slice(0, 6).map((info, index) => (
                        <LevelCollapsible
                            name={info.node.name}
                            effects={info.totalEffects}
                            level={index + 1}
                            onDelete={() => {}}
                            onHoverDelete={() => {}}
                        />
                    ))}
                </Column>
                {levelInfo.length > 6 && (
                    <Column>
                        {levelInfo.slice(6).map((info, index) => (
                            <LevelCollapsible
                                name={info.node.name}
                                effects={info.totalEffects}
                                level={index + 7}
                                onDelete={() => {}}
                                onHoverDelete={() => {}}
                            />
                        ))}
                    </Column>
                )}
            </ContentSection>
        </TabPanel>
    );
}
