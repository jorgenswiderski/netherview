// class-collapsible.tsx
import React from 'react';
import StarIcon from '@mui/icons-material/Star';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import IconButton from '@mui/material/IconButton';
import styled from '@emotion/styled';
import Box from '@mui/material/Box';
import { CollapsibleSection } from '../../character-display/collapsible-section';
import LevelCollapsible from './level-collapsible';
import { ICharacterTreeDecision } from '../../../models/character/character-tree-node/types';
import { CharacterClassInfoToggled } from './types';

const LevelBox = styled(Box)`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

interface ClassCollapsibleProps {
    info: CharacterClassInfoToggled;
    isMainClass: boolean;
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
                    <IconButton
                        onClick={(event) => {
                            event.stopPropagation();
                            onFavorite(info);
                        }}
                    >
                        {isMainClass ? (
                            <StarIcon />
                        ) : (
                            <StarOutlineIcon color="disabled" />
                        )}
                    </IconButton>
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
                </>
            }
        >
            <LevelBox>
                {info.levels.map(({ node, totalEffects, disabled }, index) => (
                    <LevelCollapsible
                        effects={totalEffects}
                        level={index + 1}
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
