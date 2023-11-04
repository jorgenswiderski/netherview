// class-collapsible.tsx
import React from 'react';
import StarIcon from '@mui/icons-material/Star';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import styled from '@emotion/styled';
import { Box, Tooltip, IconButton } from '@mui/material';
import { CollapsibleSection } from '../character-display/collapsible-section';
import LevelCollapsible from './level-collapsible';
import { ICharacterTreeDecision } from '../../models/character/character-tree-node/types';
import { CharacterClassInfoToggled } from './types';

const LevelBox = styled(Box)`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

interface ClassCollapsibleProps {
    info: CharacterClassInfoToggled;
    isMainClass: boolean;
    onEdit: (level: ICharacterTreeDecision) => void;
    onDelete: (
        info: CharacterClassInfoToggled,
        level: ICharacterTreeDecision,
    ) => void;
    onHoverDelete: (
        info: CharacterClassInfoToggled,
        level: ICharacterTreeDecision,
        hover: boolean,
    ) => void;
    onFavorite: (info: CharacterClassInfoToggled) => void;
}

export default function ClassCollapsible({
    info,
    isMainClass,
    onEdit,
    onDelete,
    onHoverDelete,
    onFavorite,
}: ClassCollapsibleProps) {
    return (
        <CollapsibleSection
            title={info.class.name}
            elevation={3}
            headerButtons={
                <>
                    <Tooltip
                        title={
                            isMainClass
                                ? `Grants the proficiencies of a 1st-level ${info.class.name}`
                                : `Set as the primary class, granting all the proficiencies of a 1st-level ${info.class.name}`
                        }
                        PopperProps={{ style: { pointerEvents: 'none' } }}
                    >
                        {/* Wrap in span to allow tooltip even when button is disabled */}
                        <span>
                            <IconButton
                                onClick={(event) => {
                                    event.stopPropagation();
                                    onFavorite(info);
                                }}
                                disabled={isMainClass}
                            >
                                {isMainClass ? (
                                    <StarIcon />
                                ) : (
                                    <StarOutlineIcon color="disabled" />
                                )}
                            </IconButton>
                        </span>
                    </Tooltip>
                    <Tooltip
                        title={`Remove all levels of ${info.class.name}`}
                        PopperProps={{ style: { pointerEvents: 'none' } }}
                    >
                        <IconButton
                            onClick={(event) => {
                                event.stopPropagation();
                                onDelete(info, info.levels[0]!.node);
                            }}
                            onMouseEnter={() =>
                                onHoverDelete(info, info.levels[0]!.node, true)
                            }
                            onMouseLeave={() =>
                                onHoverDelete(info, info.levels[0]!.node, false)
                            }
                        >
                            <DeleteOutlineIcon color="disabled" />
                        </IconButton>
                    </Tooltip>
                </>
            }
        >
            <LevelBox>
                {info.levels.map(({ node, totalEffects, disabled }, index) => (
                    <LevelCollapsible
                        name={info.class.name}
                        effects={totalEffects}
                        level={index + 1}
                        onEdit={
                            node.numChoices > 0 ? () => onEdit(node) : undefined
                        }
                        onDelete={() => onDelete(info, node)}
                        onHoverDelete={(hover: boolean) =>
                            onHoverDelete(info, node, hover)
                        }
                        disabled={disabled}
                    />
                ))}
            </LevelBox>
        </CollapsibleSection>
    );
}
