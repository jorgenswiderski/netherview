// index.tsx
import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { BeatLoader } from 'react-spinners';
import CharacterPlanner from '../components/character-planner/character-planner';
import { WeaveApi } from '../api/weave/weave';
import { CharacterClassOption } from '../models/character/types';

const PageContainer = styled.div`
    color: #e0e0e0;
    background-color: #1a1a1a;
    min-height: 100vh; // ensure at least full viewport height
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 50px;
    box-sizing: border-box;
    overflow-y: auto; // Enable vertical scrolling if content overflows

    @media (max-width: 768px) {
        padding: 20px; // Reduced padding for mobile devices
    }

    @media (max-width: 480px) {
        padding: 10px; // Further reduced padding for very small screens
    }
`;

export default function HomePage() {
    const [classData, setClassData] = useState<CharacterClassOption[] | null>();

    useEffect(() => {
        async function fetchClassData() {
            return WeaveApi.getClassesInfo();
        }

        fetchClassData().then((data) => setClassData(data));
    }, []);

    return (
        <PageContainer>
            {!classData ? (
                <BeatLoader />
            ) : (
                <CharacterPlanner classData={classData} />
            )}
        </PageContainer>
    );
}
