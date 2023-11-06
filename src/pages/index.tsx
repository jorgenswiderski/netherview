// index.tsx
import React from 'react';
import styled from '@emotion/styled';
import { BeatLoader } from 'react-spinners';
import { Box } from '@mui/material';
import { useCharacter } from '../context/character-context/character-context';
import { CharacterPlanner } from '../components/character-planner/character-planner';

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: center;

    height: 100vh;
    width: 100%;
    padding: 50px;
    box-sizing: border-box;
    overflow-y: auto;

    @media (max-width: 768px) {
        height: auto;
        padding: 20px; // Reduced padding for mobile devices
    }

    @media (max-width: 480px) {
        padding: 10px; // Further reduced padding for very small screens
    }
`;

const CenteredBox = styled(Box)`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    flex-direction: column;
`;

export default function HomePage() {
    const { character } = useCharacter();

    if (!character) {
        return (
            <CenteredBox>
                <BeatLoader />
            </CenteredBox>
        );
    }

    return (
        <PageContainer>
            <CharacterPlanner character={character} />
        </PageContainer>
    );
}
