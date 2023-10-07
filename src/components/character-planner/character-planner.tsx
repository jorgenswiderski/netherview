// character-planner.tsx
import styled from 'styled-components';
import React, { useCallback, useState } from 'react';
import { Character } from '../../models/character/character';
import { CharacterStateInfo } from '../../models/character/character-states';
import { CharacterEvents } from '../../models/character/types';

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

    const handleEvent = useCallback((event: CharacterEvents, value: any) => {
        setCharacter((prevCharacter) => prevCharacter.onEvent(event, value));
    }, []);

    return (
        <Container>
            <Title>{CharacterStateInfo[character.state].title}</Title>
            {CharacterStateInfo[character.state].render({
                onEvent: handleEvent,
            })}
        </Container>
    );
}
