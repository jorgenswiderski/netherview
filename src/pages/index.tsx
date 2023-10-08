import React from 'react';
import styled from 'styled-components';
import CharacterPlanner from '../components/character-planner/character-planner';

const PageContainer = styled.div`
    color: #e0e0e0;
    background-color: #1a1a1a;
    min-height: 100vh;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    box-sizing: border-box;
    overflow: hidden;
`;

export default function HomePage() {
    return (
        <PageContainer>
            <CharacterPlanner />
        </PageContainer>
    );
}
