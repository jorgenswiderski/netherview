// level-collapsible.tsx
import React, { useEffect } from 'react';
import { GrantableEffect } from 'planner-types/src/types/grantable-effect';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import styled from '@emotion/styled';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import IconButton from '@mui/material/IconButton';
import { CollapsibleSection } from '../../character-display/collapsible-section';
import GrantedEffect from '../feature-picker/prospective-effects/granted-effect';
import { log } from '../../../models/logger';

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
    effects: GrantableEffect[];
    level: number;
    onDelete: () => void;
    onHoverDelete: (hover: boolean) => void;
    disabled?: boolean;
}

export default function LevelCollapsible({
    effects,
    level,
    onDelete,
    onHoverDelete,
    disabled = false,
}: LevelCollapsibleProps) {
    useEffect(() => log(disabled), [disabled]);

    return (
        <StyledCollapsibleSection
            defaultExpanded={false}
            title={`Level ${level}`}
            headerButtons={
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
