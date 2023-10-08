// character-planner.tsx
import styled from 'styled-components';
import React, { useCallback, useState } from 'react';
import { Character } from '../../models/character/character';
import { CharacterStateInfo } from '../../models/character/character-states';
import { CharacterEvents } from '../../models/character/types';
import CharacterDisplay from './character-display';

const Container = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    gap: 40px;
    background-color: #1a1a1a; // Darker background for the main container
`;

const PanelContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 40px 0px;
    width: 45%;
    max-width: 600px;
    height: 100%;
    border: 2px solid #8a8a8a; // Light gray for border
    border-radius: 8px;
    padding: 20px;
    background-color: #2a2a2a; // Base dark gray
`;

const Title = styled.h1`
    font-size: 2rem;
    margin-bottom: 20px;
    color: #e0e0e0; // Light gray for text
`;

export default function CharacterPlanner() {
    const [character, setCharacter] = useState(new Character());

    const handleEvent = useCallback((event: CharacterEvents, values: any) => {
        setCharacter((prevCharacter) => prevCharacter.onEvent(event, values));
    }, []);

    return (
        <Container>
            <PanelContainer>
                <Title>{CharacterStateInfo[character.state].title}</Title>
                {CharacterStateInfo[character.state].render({
                    onEvent: handleEvent,
                })}
            </PanelContainer>
            {character.race && character.levels.length && (
                <PanelContainer>
                    <CharacterDisplay character={character} />
                </PanelContainer>
            )}
        </Container>
    );
}
