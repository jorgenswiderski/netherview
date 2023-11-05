import React, { useMemo } from 'react';
import styled from '@emotion/styled';
import { Paper } from '@mui/material';
import AbilityScoresTable from './ability-scores';
import { CharacterEffects } from './character-effects';
import { CharacterHeader } from './character-header';
import { EquipmentPanel } from './equipment/equipment-panel';
import CharacterBackground from './character-background';
import { useCharacter } from '../../context/character-context/character-context';
import { ChooseNextStep } from '../character-planner/choose-next-step';
import { useResponsive } from '../../hooks/use-responsive';

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

export default function CharacterDisplay() {
    const { isMobile } = useResponsive();
    const { character } = useCharacter();

    const abilityScores = useMemo(
        () => character.getTotalAbilityScores(),
        [character],
    );

    const background = useMemo(() => character.getBackground(), [character]);

    return (
        <PaperContainer>
            <CharacterHeader />
            {isMobile && !character.getNextDecision() && <ChooseNextStep />}

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
        </PaperContainer>
    );
}
