// index.tsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { BeatLoader } from 'react-spinners';
import CharacterPlanner from '../components/character-planner/character-planner';
import { WeaveApi } from '../api/weave/weave';
import { CharacterClassOption } from '../components/character-planner/feature-picker/types';

const PageContainer = styled.div`
    color: #e0e0e0;
    background-color: #1a1a1a;
    height: 100vh;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 50px;
    box-sizing: border-box;
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
