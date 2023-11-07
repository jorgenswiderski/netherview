import { ISpell } from '@jorgenswiderski/tomekeeper-shared/dist/types/action';
import { Card, CardActionArea, CardMedia } from '@mui/material';
import React, { RefObject, useRef } from 'react';
import styled from '@emotion/styled';
import { WeaveImages } from '../api/weave/weave-images';
import { ActionTooltip } from './tooltips/action-tooltip';

const StyledCard = styled(Card)<{ selected: boolean }>`
    aspect-ratio: 1;
    opacity: ${(props) => (props.selected ? 0.85 : 1)};
    border: 3px solid ${(props) => (props.selected ? '#3f51b5' : 'transparent')};
    width: 36px;
`;

const ActionArea = styled(CardActionArea)`
    position: relative;
    height: 100%;
`;

interface SpellCardMediaProps {
    spell?: ISpell;
    containerRef: RefObject<HTMLButtonElement>;
}

function SpellCardMedia({ spell, containerRef }: SpellCardMediaProps) {
    return (
        spell?.image && (
            <CardMedia
                component="img"
                image={WeaveImages.getPath(spell.image, containerRef)}
            />
        )
    );
}

interface SpellCardProps {
    selected?: boolean;
    spell?: ISpell;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export function SpellCard({
    selected = false,
    spell,
    onClick,
}: SpellCardProps) {
    const imageContainerRef = useRef<HTMLButtonElement>(null);

    return (
        <ActionTooltip action={spell}>
            <StyledCard elevation={3} selected={selected}>
                {spell && onClick ? (
                    <ActionArea onClick={onClick} ref={imageContainerRef}>
                        <SpellCardMedia
                            spell={spell}
                            containerRef={imageContainerRef}
                        />
                    </ActionArea>
                ) : (
                    <SpellCardMedia
                        spell={spell}
                        containerRef={imageContainerRef}
                    />
                )}
            </StyledCard>
        </ActionTooltip>
    );
}
