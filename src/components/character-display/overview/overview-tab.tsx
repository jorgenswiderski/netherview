import React, { useMemo } from 'react';
import styled from '@emotion/styled';
import { useCharacter } from '../../../context/character-context/character-context';
import { EquipmentPanel } from '../equipment/equipment-panel';
import { AbilityScoresTable } from './ability-scores';
import { CharacterBackground } from './character-background';
import { CharacterEffects } from './character-effects';
import { TabPanel } from '../../simple-tabs/tab-panel';
import { TabPanelProps } from '../../simple-tabs/types';

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

const LeftRightBase = styled.div`
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

const LeftSection = styled(LeftRightBase)`
    max-width: 333px;

    @media (max-width: 768px) {
        max-width: unset;
        width: 100%;
        box-sizing: border-box;
    }
`;

const RightSection = styled(LeftRightBase)`
    // flex-wrap: wrap;
`;

interface OverviewTabProps extends TabPanelProps {}

export function OverviewTab({ ...panelProps }: OverviewTabProps) {
    const { character } = useCharacter();

    const abilityScores = useMemo(
        () => character.getTotalAbilityScores(),
        [character],
    );

    const background = useMemo(() => character.getBackground(), [character]);

    return (
        <TabPanel {...panelProps}>
            <ContentSection>
                <LeftSection>
                    {abilityScores && (
                        <AbilityScoresTable abilityScores={abilityScores} />
                    )}
                    {background && (
                        <CharacterBackground background={background} />
                    )}
                    <EquipmentPanel />
                </LeftSection>

                <RightSection>
                    <CharacterEffects />
                </RightSection>
            </ContentSection>
        </TabPanel>
    );
}
