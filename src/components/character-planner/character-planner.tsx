import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BeatLoader } from 'react-spinners';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import styled from '@emotion/styled';
import { ICharacterOption } from 'planner-types/src/types/character-feature-customization-option';
import Paper from '@mui/material/Paper';
import { ISpell } from 'planner-types/src/types/spells';
import Box from '@mui/material/Box';
import { Character } from '../../models/character/character';
import {
    IPendingDecision,
    CharacterDecisionInfo,
} from '../../models/character/character-states';
import FeaturePicker from './feature-picker/feature-picker';
import { CharacterClassOption } from '../../models/character/types';
import CharacterDisplay from '../character-display/character-display';
import TreeVisualization from '../tree-visualization';

const Container = styled(Box)`
    display: flex;
    flex-direction: row;
    align-items: stretch;
    justify-content: center;
    width: 100%;
    height: 100%;
    min-height: 100%;
    gap: 40px;
    margin: auto 0;

    @media (max-width: 768px) {
        flex-direction: column-reverse;
        gap: 1rem;
    }
`;

const ResetButton = styled(Button)`
    position: absolute;
    top: 10px;
    right: 10px;
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
    padding: 1rem;
    gap: 1rem;

    @media (max-width: 768px) {
        width: 100%;
        box-sizing: border-box;
    }
`;

const PlannerContainer = styled(PaperContainer)`
    flex: 1;
    max-width: 600px;
`;

const PlannerHeader = styled(Paper)`
    width: 100%;
    text-align: center;
    padding: 1rem;
    box-sizing: border-box;
`;

interface CharacterPlannerProps {
    classData: CharacterClassOption[];
    spellData: ISpell[];
}

export default function CharacterPlanner({
    classData,
    spellData,
}: CharacterPlannerProps) {
    const [character, setCharacter] = useState(
        new Character(classData, spellData),
    );
    const [loading] = useState(false);
    const nextDecision = useMemo(
        () => character.pendingDecisions[0],
        [character],
    );
    const nextDecisionInfo = useMemo(
        () => (nextDecision ? CharacterDecisionInfo[nextDecision.type] : null),
        [nextDecision],
    );

    useEffect(() => {
        if (
            character.pendingDecisions.length < 2 &&
            character.pendingSteps.length
        ) {
            character.queueNextStep().then((char) => {
                if (char) {
                    setCharacter(char);
                }
            });
        }
    }, [character]);

    const handleDecision = useCallback(
        (
            decision: IPendingDecision,
            choices: ICharacterOption | ICharacterOption[],
        ) => {
            const newCharacter = character.makeDecision(decision, choices);
            setCharacter(newCharacter);
        },
        [character],
    );

    const levelUpCharacter = useCallback(() => {
        const newCharacter = character.levelUp();
        setCharacter(newCharacter);
    }, [character]);

    const handleReset = () => {
        setCharacter(new Character(classData, spellData)); // Reset the character to its initial state
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
                    {`Warning: No decision info for '${nextDecision.type}'.`}
                </Typography>
            );
        }

        if (
            loading ||
            (character.pendingDecisions.length === 0 &&
                character.pendingSteps.length)
        ) {
            return <BeatLoader />;
        }

        return (
            <>
                <PlannerHeader elevation={2}>
                    <Typography variant="h4">
                        {nextDecisionInfo.title}
                    </Typography>
                </PlannerHeader>
                {nextDecisionInfo.render ? (
                    nextDecisionInfo.render({
                        onDecision: handleDecision,
                        decision: nextDecision,
                        character,
                    })
                ) : (
                    <FeaturePicker
                        onEvent={handleDecision}
                        decision={nextDecision}
                    />
                )}
            </>
        );
    };

    return (
        <Box
            style={{
                display: 'flex',
                gap: '4rem',
                flexDirection: 'column',
                height: '100%',
                width: '100%',
            }}
        >
            <ResetButton
                variant="contained"
                color="primary"
                onClick={handleReset}
            >
                Reset
            </ResetButton>
            <Container>
                {character.root.children && // FIXME
                    character.root.children.length > 1 && (
                        <CharacterDisplay character={character} />
                    )}

                <PlannerContainer>{renderDecisionPanel()}</PlannerContainer>
            </Container>
            <TreeVisualization
                data={JSON.parse(JSON.stringify(character.root))}
            />
        </Box>
    );
}
