// character-planner.tsx
import styled from 'styled-components';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BeatLoader } from 'react-spinners';
import Typography from '@mui/material/Typography';
import { Character } from '../../models/character/character';
import { CharacterDecisionInfo } from '../../models/character/character-states';
import { CharacterEvents } from '../../models/character/types';
import CharacterDisplay from './character-display';
import { ICharacterFeatureCustomizationOption } from './choice-picker/types';
import FeaturePicker from './feature-picker/feature-picker';

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

const ResetButton = styled.button`
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 5px 15px;
    border: none;
    border-radius: 5px;
    background-color: #555; // Dark background for the button
    color: #e0e0e0; // Light gray for text
    cursor: pointer;

    &:hover {
        background-color: #777; // Slightly lighter on hover
    }
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

export default function CharacterPlanner() {
    const [character, setCharacter] = useState(new Character());
    const nextDecision = useMemo(() => character.nextDecision(), [character]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchChoices() {
            if (
                nextDecision &&
                !nextDecision.choices &&
                CharacterDecisionInfo[nextDecision.type].getChoices
            ) {
                setLoading(true);
                const gc = CharacterDecisionInfo[nextDecision.type]
                    .getChoices as () => Promise<
                    ICharacterFeatureCustomizationOption[][]
                >;

                nextDecision.choices = (await gc()) ?? undefined;
                setLoading(false);
            }
        }

        fetchChoices();
    }, [nextDecision]);

    const handleEvent = useCallback((event: CharacterEvents, values: any) => {
        setCharacter((prevCharacter) => prevCharacter.onEvent(event, values));
    }, []);

    const handleReset = () => {
        setCharacter(new Character()); // Reset the character to its initial state
    };

    return (
        <>
            <ResetButton onClick={handleReset}>Reset</ResetButton>
            <Container>
                {nextDecision &&
                    (loading || !nextDecision.choices ? (
                        <BeatLoader />
                    ) : (
                        <PanelContainer>
                            <Typography variant="h4" gutterBottom>
                                {CharacterDecisionInfo[nextDecision.type].title}
                            </Typography>
                            {nextDecision.choices.map((choice) => (
                                <FeaturePicker
                                    choices={choice}
                                    onEvent={handleEvent}
                                    event={nextDecision.type}
                                />
                            ))}
                        </PanelContainer>
                    ))}
                {character.race && character.levels.length > 0 && (
                    <PanelContainer>
                        <CharacterDisplay character={character} />
                    </PanelContainer>
                )}
            </Container>
        </>
    );
}
