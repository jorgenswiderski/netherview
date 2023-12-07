import { ISpell } from '@jorgenswiderski/tomekeeper-shared/dist/types/action';
import { CardActionArea, CardMedia } from '@mui/material';
import React, { RefObject, useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { WeaveImages } from '../../api/weave/weave-images';
import { ActionTooltip } from '../tooltips/action-tooltip/action-tooltip';
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
    const [path, setPath] = useState<string>();

    useEffect(() => {
        if (spell?.image) {
            setPath(WeaveImages.getPath(spell.image, containerRef));
        }
    }, [spell?.image, containerRef]);

    return path && <CardMedia component="img" image={path} />;
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
            </StyledIconCard>
        </ActionTooltip>
    );
}
