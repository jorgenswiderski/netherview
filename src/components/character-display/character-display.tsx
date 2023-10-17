import React, { useMemo } from 'react';
import Paper from '@mui/material/Paper';
import styled from '@emotion/styled';
import { Character } from '../../models/character/character';
import AbilityScoresTable from './ability-scores';
import { CharacterEffects } from './character-effects';
import { CharacterHeader } from './character-header';
import CharacterItems from './character-items';
import CharacterBackground from './character-background';

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
        width: 100%;
        box-sizing: border-box;
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
`;

const LeftSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 333px;
    height: 100%;
    overflow-y: auto;
    flex: 1;
`;

const StyledPaper = styled(Paper)`
    padding: 1rem;
    flex: 1;
`;

const RightSection = styled.div`
    flex: 1;
    overflow-y: auto;

    display: flex;
    flex-direction: column;
    // flex-wrap: wrap;
    gap: 1rem;
    height: 100%;
`;

interface CharacterDisplayProps {
    character: Character;
}

export default function CharacterDisplay({ character }: CharacterDisplayProps) {
    const abilityScores = useMemo(
        () => character.getTotalAbilityScores(),
        [character],
    );

    const background = useMemo(() => character.getBackground(), [character]);

    return (
        <PaperContainer>
            <CharacterHeader character={character} />

            <ContentSection>
                <LeftSection>
                    {abilityScores && (
                        <AbilityScoresTable abilityScores={abilityScores} />
                    )}
                    {background && (
                        <CharacterBackground background={background} />
                    )}
                    <StyledPaper elevation={2}>
                        <CharacterItems />
                    </StyledPaper>
                </LeftSection>

                <RightSection>
                    <CharacterEffects character={character} />
                </RightSection>
            </ContentSection>
        </PaperContainer>
    );
}
