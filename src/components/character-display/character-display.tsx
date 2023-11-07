import React from 'react';
import styled from '@emotion/styled';
import { Paper } from '@mui/material';
import { CharacterHeader } from './character-header';
import { useCharacter } from '../../context/character-context/character-context';
import { ChooseNextStep } from '../character-planner/choose-next-step';
import { useResponsive } from '../../hooks/use-responsive';
import { SimpleTabs } from '../simple-tabs/simple-tabs';
import { OverviewTab } from './overview/overview-tab';

const PaperContainer = styled(Paper)`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    padding: 1rem;
    gap: 1rem;
    min-width: 600px;
    max-width: 925px;
    width: auto;
    // flex: 1;
    overflow-y: hidden;

    @media (max-width: 768px) {
        min-width: unset;
        width: 100%;
        box-sizing: border-box;
        overflow-y: unset;
    }
`;

export function CharacterDisplay() {
    const { isMobile } = useResponsive();
    const { character } = useCharacter();

    return (
        <PaperContainer>
            <CharacterHeader />
            {isMobile && !character.getNextDecision() && <ChooseNextStep />}

            <SimpleTabs tabs={[{ label: 'Overview', element: OverviewTab }]} />
        </PaperContainer>
    );
}
