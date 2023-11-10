import React from 'react';
import styled from '@emotion/styled';
import { Paper } from '@mui/material';
import { SimpleTabs } from '../simple-tabs/simple-tabs';
import { useResponsive } from '../../hooks/use-responsive';
import { ChooseNextStep } from '../character-planner/choose-next-step';
import { useCharacter } from '../../context/character-context/character-context';
import { CharacterHeader } from './character-header';
import { characterDisplayTabs } from './character-display-tabs';

const PaperContainer = styled(Paper)`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    padding: 1rem;
    gap: 1rem;
    min-width: 600px;
    max-width: 925px;
    width: auto;
    flex: 1;

    @media (max-width: 768px) {
        width: 100%;
        min-width: auto;
        padding: 0.5rem;
        box-sizing: border-box;
    }
`;

export function CharacterDisplay() {
    const { isMobile } = useResponsive();
    const { character } = useCharacter();

    return (
        <PaperContainer>
            <CharacterHeader />
            {isMobile && !character.getNextDecision() && <ChooseNextStep />}

            <SimpleTabs tabs={characterDisplayTabs} />
        </PaperContainer>
    );
}
