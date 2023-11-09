import { ISpell } from '@jorgenswiderski/tomekeeper-shared/dist/types/action';
import { CardActionArea, CardMedia } from '@mui/material';
import React, { RefObject, useRef } from 'react';
import styled from '@emotion/styled';
import { WeaveImages } from '../../api/weave/weave-images';
import { ActionTooltip } from '../tooltips/action-tooltip';
import { StyledIconCard } from './styled-icon-card';

const ActionArea = styled(CardActionArea)`
    position: relative;
    height: 100%;
`;

interface SpellCardMediaProps {
    spell?: ISpell;
    containerRef: RefObject<HTMLDivElement>;
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
    spell?: ISpell;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    selected?: boolean;
    elevation?: number;
}

export function SpellIconCard({
    spell,
    onClick,
    selected = false,
    elevation = 3,
}: SpellCardProps) {
    const imageContainerRef = useRef<HTMLDivElement>(null);

    return (
        <ActionTooltip action={spell}>
            <StyledIconCard
                elevation={elevation}
                selected={selected}
                ref={imageContainerRef}
            >
                {spell && onClick ? (
                    <ActionArea onClick={onClick}>
                        {imageContainerRef.current && (
                            <SpellCardMedia
                                spell={spell}
                                containerRef={imageContainerRef}
                            />
                        )}
                    </ActionArea>
                ) : (
                    <SpellCardMedia
                        spell={spell}
                        containerRef={imageContainerRef}
                    />
                )}
            </StyledIconCard>
        </ActionTooltip>
    );
}
