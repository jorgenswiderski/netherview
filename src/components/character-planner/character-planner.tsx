import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BeatLoader } from 'react-spinners';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import styled from '@emotion/styled';
import { ICharacterFeatureCustomizationOption } from 'planner-types/src/types/character-feature-customization-option';
import Paper from '@mui/material/Paper';
import { Character } from '../../models/character/character';
import {
    IPendingDecision,
    CharacterDecisionInfo,
} from '../../models/character/character-states';
import FeaturePicker from './feature-picker/feature-picker';
import { CharacterClassOption } from '../../models/character/types';
import CharacterDisplay from '../character-display/character-display';
import TreeVisualization from '../tree-visualization';

const Container = styled('div')`
    display: flex;
    flex-direction: row;
    align-items: stretch;
    justify-content: center;
    width: 100%;
    height: 100%;
    gap: 40px;
    margin: auto 0;

    @media (max-width: 768px) {
        flex-direction: column-reverse;
        gap: 1rem;
    }
`;

const ResetButton = styled('button')`
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 8px 20px; // slightly larger for mobile touch
    border: none;
    border-radius: 5px;
    cursor: pointer;

    @media (max-width: 768px) {
        position: static;
        margin-bottom: 1rem;
    }
`;

const PaperContainer = styled(Paper)`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 50%;
    max-width: 600px;
    padding: 1rem;
    gap: 1rem;

    @media (max-width: 768px) {
        width: 100%;
        box-sizing: border-box;
    }
`;

const PlannerHeader = styled(Paper)`
    width: 100%;
    text-align: center;
    padding: 1rem;
    box-sizing: border-box;
`;

interface CharacterPlannerProps {
    classData: CharacterClassOption[];
}

export default function CharacterPlanner({ classData }: CharacterPlannerProps) {
    const [character, setCharacter] = useState(new Character(classData));
    const [loading, setLoading] = useState(false);
    const nextDecision = useMemo(
        () => character.pendingDecisions[0],
        [character],
    );
    const nextDecisionInfo = useMemo(
        () => (nextDecision ? CharacterDecisionInfo[nextDecision.type] : null),
        [nextDecision],
    );

    const loadChoices = useCallback(
        async (decision: IPendingDecision) => {
            setLoading(true);

            const newCharacter: Character | null = (await decision.loadChoices(
                character,
            )) as Character | null;

            if (newCharacter) {
                setCharacter(newCharacter);
            }

            setLoading(false);
        },
        [character],
    );

    useEffect(() => {
        if (nextDecision) {
            loadChoices(nextDecision);
        }
    }, [nextDecision]);

    useEffect(() => {
        const secondDecision = character.pendingDecisions[1];

        if (secondDecision) {
            loadChoices(secondDecision);
        }
    }, [character]);

    const handleDecision = (
        decision: IPendingDecision,
        choice: ICharacterFeatureCustomizationOption,
    ) => {
        setCharacter((prevCharacter) =>
            prevCharacter.makeDecision(decision, choice),
        );
    };

    const levelUpCharacter = () => {
        setCharacter((prevCharacter) => prevCharacter.levelUp());
    };

    const handleReset = () => {
        setCharacter(new Character(classData)); // Reset the character to its initial state
    };

    const renderDecisionPanel = () => {
        if (!nextDecision) {
            if (character.canLevel()) {
                return (
                    <>
                        <PlannerHeader elevation={2}>
                            <Typography variant="h4">
                                Ready to level up?
                            </Typography>
                        </PlannerHeader>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={levelUpCharacter}
                        >
                            Level Up
                        </Button>
                    </>
                );
            }

            return null;
        }

        if (!nextDecisionInfo) {
            return (
                <Typography variant="h4" color="error">
                    {`Warning: Invalid decision type '${nextDecision.type}'.`}
                </Typography>
            );
        }

        if (loading || typeof nextDecision.choices === 'undefined') {
            return <BeatLoader />;
        }

        return (
            <>
                <PlannerHeader elevation={2}>
                    <Typography variant="h4">
                        {nextDecisionInfo.title}
                    </Typography>
                </PlannerHeader>
                {nextDecisionInfo.render
                    ? nextDecisionInfo.render({
                          onDecision: handleDecision,
                          decision: nextDecision,
                      })
                    : nextDecision.choices.map((choice) => (
                          <FeaturePicker
                              choices={choice}
                              onEvent={handleDecision}
                              decision={nextDecision}
                          />
                      ))}
            </>
        );
    };

    return (
        <>
            <ResetButton onClick={handleReset}>Reset</ResetButton>
            <Container>
                {character.root.children &&
                    character.root.children.length > 1 && (
                        <PaperContainer>
                            <CharacterDisplay character={character} />
                        </PaperContainer>
                    )}

                <PaperContainer>{renderDecisionPanel()}</PaperContainer>
            </Container>
            <TreeVisualization
                data={JSON.parse(JSON.stringify(character.root))}
            />
        </>
    );
}
