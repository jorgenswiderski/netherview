import React from 'react';
import styled from 'styled-components';

import CharacterPlanner from '../components/character-planner/character-planner';

const PageContainer = styled.div`
    color: rgb(210, 210, 210);
    background-color: #232323;
    min-height: 100vh;
    width: 100%;
`;

export default function HomePage() {
    return (
        <PageContainer>
            <CharacterPlanner />
        </PageContainer>
    );
}
