import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BeatLoader } from 'react-spinners';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import styled from '@emotion/styled';
import { ICharacterOption } from 'planner-types/src/types/character-feature-customization-option';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { useRouter } from 'next/router';
import Alert from '@mui/material/Alert';
import { Character } from '../../models/character/character';
import {
    IPendingDecision,
    CharacterDecisionInfo,
} from '../../models/character/character-states';
import FeaturePicker from './feature-picker/feature-picker';
import CharacterDisplay from '../character-display/character-display';
import TreeVisualization from '../tree-visualization';
import SettingsMenu from '../character-display/settings-menu/settings-menu';
import { error, log } from '../../models/logger';
import {
    InternOption,
    TreeCompressor,
} from '../../models/compressor/compressor';

const Container = styled(Box)`
    display: flex;
    flex-direction: row;
    align-items: stretch;
    justify-content: center;
    gap: 40px;

    position: relative;
    margin: auto 0;
    width: 100%;
    height: 100%;
    min-height: 100%;

    @media (max-width: 768px) {
        flex-direction: column-reverse;
        gap: 1rem;
    }
`;

const ButtonBox = styled(Box)`
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    width: 100%;
    padding: 0 2rem;
    box-sizing: border-box;

    display: flex;
    gap: 0.5rem;

    @media (max-width: 768px) {
        position: static;
        margin-bottom: 1rem;
        width: 100%;
    }
`;

const DevButton = styled(Button)`
    @media (max-width: 768px) {
        flex: 1;
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
    position: relative;
`;

const PlannerHeader = styled(Paper)`
    width: 100%;
    text-align: center;
    padding: 1rem;
    box-sizing: border-box;
`;

const TreeVisualizationOverlay = styled(TreeVisualization)`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10; // Ensures it's above other content
`;

const StyledSettingsMenu = styled(SettingsMenu)`
    position: absolute;
    top: 10px;
    right: 10px;
`;

interface CharacterPlannerProps {
    character: Character;
}

export default function CharacterPlanner({
    character: initialCharacter,
}: CharacterPlannerProps) {
    const router = useRouter();

    const [isTreeVisible, setIsTreeVisible] = useState(false);
    const [loading] = useState(false);
    const [exportOverflow, setExportOverflow] = useState<number | null>(null);

    const [character, setCharacter] = useState<Character>(
        () => initialCharacter,
    );

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

    useEffect(() => {
        if (character.canExport()) {
            log(character.root);
            // log(JSON.parse(JSON.stringify(character.root)));
            const result = TreeCompressor.internStrings(
                JSON.parse(JSON.stringify(character.root)),
            );
            const result2 = TreeCompressor.internStrings(
                JSON.parse(JSON.stringify(result.value)),
                InternOption.KEYS,
            );
            log({ o: result2.value, v: result.map, k: result2.map });

            TreeCompressor.deflate(character.root);
        }
    }, [character]);

    useEffect(() => {
        async function updateUrl() {
            const exportStr = await character.export();

            setExportOverflow(
                exportStr.length > 2000 ? exportStr.length : null,
            );

            router.replace(
                { pathname: router.pathname },
                { pathname: `/b/${exportStr}` },
                {
                    shallow: true,
                },
            );
        }

        if (character.canExport()) {
            updateUrl().catch(error);
        }
    }, [character]);

    const handleReset = () => {
        setCharacter(
            new Character(character.baseClassData, character.spellData),
        );
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
                        onDecision={handleDecision}
                        decision={nextDecision}
                        {...nextDecisionInfo.extraFeaturePickerArgs}
                    />
                )}
            </>
        );
    };

    return (
        <>
            <ButtonBox>
                {exportOverflow !== null && (
                    <Alert
                        severity="warning"
                        sx={{
                            flex: 1,
                            zIndex: 1200,
                        }}
                    >
                        Export data is too large ({exportOverflow} characters).
                        Some features might not work as expected.
                    </Alert>
                )}
                <StyledSettingsMenu
                    character={character}
                    updateCharacter={setCharacter}
                />
                <DevButton
                    variant="contained"
                    color="primary"
                    onClick={() => setIsTreeVisible(!isTreeVisible)}
                >
                    Toggle Tree
                </DevButton>

                <DevButton
                    variant="contained"
                    color="primary"
                    onClick={handleReset}
                >
                    Reset
                </DevButton>
            </ButtonBox>
            {isTreeVisible ? (
                <TreeVisualizationOverlay data={character.root} />
            ) : (
                <Container>
                    {character.root.children && // FIXME
                        character.root.children.length > 1 && (
                            <CharacterDisplay
                                character={character}
                                onCharacterChanged={(char) =>
                                    setCharacter(char as Character)
                                }
                            />
                        )}

                    <PlannerContainer>{renderDecisionPanel()}</PlannerContainer>
                </Container>
            )}
        </>
    );
}
