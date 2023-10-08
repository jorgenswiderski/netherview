import React from 'react';
import styled from 'styled-components';
import { Character } from '../../models/character/character';

const CharacterName = styled.div`
    font-size: 2rem;
    font-weight: 800;
    margin: 0;
    justify: left;
    width: 100%;
`;

const CharacterInfo = styled.div`
    font-size: 1.2rem;
    margin-top: 10px;
    width: 100%;
    font-weight: 600;
`;

interface CharacterDisplayProps {
    character: Character;
}

export default function CharacterDisplay({ character }: CharacterDisplayProps) {
    return (
        <>
            <CharacterName>{character.name}</CharacterName>
            <CharacterInfo>
                {`${character.subrace?.name ?? character.race?.name} ${
                    character.levels[0]
                }`}
            </CharacterInfo>
        </>
    );
}
