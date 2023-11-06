import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import {
    CharacterPlannerStep,
    ICharacterOption,
} from '@jorgenswiderski/tomekeeper-shared/dist/types/character-feature-customization-option';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { IconButton, Box, DialogContentText } from '@mui/material';
import ClassCollapsible from './class-collapsible';
import {
    CharacterClassLevelInfo,
    CharacterClassOption,
    ICharacter,
} from '../../models/character/types';
import { ICharacterTreeDecision } from '../../models/character/character-tree-node/types';
import { CharacterClassInfoToggled } from './types';
import ConfirmDialog from './confirm-dialog';
import GrantedEffect from '../character-planner/feature-picker/prospective-effects/granted-effect';
import { PlannerStepTitle } from '../character-planner/planner-header/planner-step-title';

const BackIconButton = styled(IconButton)`
    position: absolute;
    left: 1.5rem;
    top: 2rem;
`;

const ItemBox = styled(Box)`
    display: flex;
    flex-direction: column;
    gap: 4px;

    padding: 0 0.5rem;
`;

const StyledBox = styled(Box)`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    width: 100%;
    overflow-y: auto;
`;

interface LevelManagerProps {
    character: ICharacter;
    onDecision: (
        decision: any,
        value: ICharacterOption | ICharacterOption[],
    ) => void;
    decision: any;
}

export default function LevelManager({
    character,
    onDecision,
    decision,
}: LevelManagerProps) {
    const initInfo = () =>
        character.getClassInfo().map((info) => ({
            ...info,
            levels: info.levels.map((level) => ({
                ...level,
                disabled: false,
            })),
        }));

    const [classInfo, setClassInfo] = useState(initInfo());

    // Reset the state if the character changes
    useEffect(() => setClassInfo(initInfo()), [character]);

    // Prompt logic ===========================================================

    const [prompt, setPrompt] = useState({
        title: '',
        isOpen: false,
        class: null as CharacterClassOption | null,
        levels: [] as CharacterClassLevelInfo[],
        getContent: null as (() => ReactNode) | null,
    });

    const resetPrompt = () =>
        setPrompt({
            title: '',
            isOpen: false,
            class: null,
            levels: [],
            getContent: null,
        });

    // "Favorite" ie primary class logic ======================================

    const onFavorite = (info: CharacterClassInfoToggled) => {
        // setClassInfo((clsInfo) => [
        //     info,
        //     ...clsInfo.filter((item) => item !== info),
        // ]);

        onDecision(decision, {
            name: info.class.name,
            type: CharacterPlannerStep.CHANGE_PRIMARY_CLASS,
        });
    };

    // Level removal logic ====================================================

    const onHoverDelete = (
        info: CharacterClassInfoToggled,
        node: ICharacterTreeDecision,
        hover: boolean,
    ) => {
        const index = info.levels.findIndex((level) => level.node === node);

        info.levels.slice(index).forEach((level) => {
            // eslint-disable-next-line no-param-reassign
            level.disabled = hover;
        });

        // force rerender
        setClassInfo((clsInfo) => [...clsInfo]);
    };

    const renderConfirmDeleteContent = (
        cls: CharacterClassOption,
        levels: CharacterClassLevelInfo[],
    ): ReactNode => {
        return (
            <>
                <DialogContentText>
                    Are you sure you want to remove {levels.length} level
                    {levels.length > 1 ? 's' : ''} of {cls.name}?
                </DialogContentText>
                <DialogContentText marginTop="1rem">
                    You will lose:
                    <ItemBox marginTop="0.5rem">
                        {levels
                            .flatMap((level) => level.totalEffects)
                            .filter((fx) => !fx.hidden)
                            .map((fx) => (
                                <GrantedEffect effect={fx} elevation={4} />
                            ))}
                    </ItemBox>
                </DialogContentText>
            </>
        );
    };

    const onDelete = (
        info: CharacterClassInfoToggled,
        node: ICharacterTreeDecision,
    ) => {
        const index = info.levels.findIndex((level) => level.node === node);

        setPrompt({
            title: 'Confirm Remove Levels',
            isOpen: true,
            class: info.class,
            levels: info.levels.slice(index),
            getContent: () =>
                renderConfirmDeleteContent(
                    info.class,
                    info.levels.slice(index),
                ),
        });
    };

    const onConfirmDelete = useCallback(() => {
        onDecision(decision, {
            name: 'Remove Class Levels',
            type: CharacterPlannerStep.REMOVE_LEVEL,
            node: prompt.levels[0].node,
        } as ICharacterOption);

        resetPrompt();
    }, [prompt]);

    // Level revision logic ===================================================

    const onEdit = useCallback(
        (level: ICharacterTreeDecision) => {
            onDecision(decision, {
                name: 'Revise Level',
                type: CharacterPlannerStep.REVISE_LEVEL,
                node: level,
            } as ICharacterOption);
        },
        [decision],
    );

    // Back button ============================================================

    const onBack = useCallback(() => {
        onDecision(decision, {
            name: 'Canceled Level Management',
            type: CharacterPlannerStep.STOP_LEVEL_MANAGEMENT,
        });
    }, [decision]);

    return (
        <>
            <PlannerStepTitle title="Revise Levels" />

            <BackIconButton onClick={onBack}>
                <KeyboardBackspaceIcon />
            </BackIconButton>
            <StyledBox>
                {classInfo.map((info, index) => (
                    <ClassCollapsible
                        key={info.class.name}
                        info={info}
                        isMainClass={index === 0}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onHoverDelete={onHoverDelete}
                        onFavorite={onFavorite}
                    />
                ))}
                <ConfirmDialog
                    title={prompt.title}
                    open={prompt.isOpen}
                    onCancel={resetPrompt}
                    onConfirm={onConfirmDelete}
                >
                    {prompt?.getContent?.()}
                </ConfirmDialog>
            </StyledBox>
        </>
    );
}
