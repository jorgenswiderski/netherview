// level-collapsible.tsx
import React from 'react';
import { GrantableEffect } from '@jorgenswiderski/tomekeeper-shared/dist/types/grantable-effect';
import styled from '@emotion/styled';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import BuildIcon from '@mui/icons-material/Build';
import { Box, Tooltip, IconButton, Typography } from '@mui/material';
import { CollapsibleSection } from '../character-display/collapsible-section';
import { GrantedEffect } from '../character-planner/feature-picker/prospective-effects/granted-effect';

const EffectBox = styled(Box)`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 4px;

    padding: 0 0.5rem;
`;

const StyledCollapsibleSection = styled(CollapsibleSection)<{
    fade?: boolean;
}>`
    opacity: ${({ fade }) => (fade ? '0.3' : '1')};
`;

interface LevelCollapsibleProps {
    name: string;
    effects: GrantableEffect[];
    level: number;
    onEdit?: () => void;
    onDelete: () => void;
    onHoverDelete: (hover: boolean) => void;
    disabled?: boolean;
}

export function LevelCollapsible({
    name,
    effects,
    level,
    onEdit,
    onDelete,
    onHoverDelete,
    disabled = false,
}: LevelCollapsibleProps) {
    return (
        <StyledCollapsibleSection
            defaultExpanded={false}
            title={`Level ${level}`}
            headerButtons={
                <>
                    {onEdit && (
                        <Tooltip
                            title="Edit the choices made at this level"
                            PopperProps={{ style: { pointerEvents: 'none' } }}
                        >
                            <IconButton
                                onClick={(event) => {
                                    event.stopPropagation();
                                    onEdit();
                                }}
                            >
                                <BuildIcon color="disabled" />
                            </IconButton>
                        </Tooltip>
                    )}
                    <Tooltip
                        title={`Remove this level and all subsequent levels of ${name}`}
                        PopperProps={{ style: { pointerEvents: 'none' } }}
                    >
                        <IconButton
                            onClick={(event) => {
                                event.stopPropagation();
                                onDelete();
                            }}
                            onMouseEnter={() => onHoverDelete(true)}
                            onMouseLeave={() => onHoverDelete(false)}
                        >
                            <DeleteOutlineIcon color="disabled" />
                        </IconButton>
                    </Tooltip>
                </>
            }
            elevation={4}
            fade={disabled}
        >
            <Typography variant="body2">
                Effects granted by this level:
            </Typography>
            <EffectBox>
                {effects
                    .filter((fx) => !fx.hidden)
                    .map((fx) => (
                        <GrantedEffect effect={fx} elevation={4} />
                    ))}
            </EffectBox>
        </StyledCollapsibleSection>
    );
}
