// character-planner.tsx

import styled from 'styled-components';
import React, { useCallback, useState } from 'react';
import { Character } from '../../models/character';
import ClassSelector from './character-class-selector';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 50px;
`;

const Title = styled.h1`
    font-size: 2rem;
    margin-bottom: 20px;
`;

export default function CharacterPlanner() {
    const [character, setCharacter] = useState(new Character());

    const handleAddClass = useCallback((selectedClass: string) => {
        setCharacter(character.addClass(selectedClass));
    }, []);

    return (
        <Container>
            {character.levels.length === 0 && (
                <>
                    <Title>Select Your Starting Class</Title>
                    <ClassSelector onAddClass={handleAddClass} />
                </>
            )}
        </Container>
    );
}
