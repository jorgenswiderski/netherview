import React, { useMemo, useRef } from 'react';
import styled from '@emotion/styled';
import { Paper, Typography } from '@mui/material';
import { WeaveImages } from '../../../../../api/weave/weave-images';
import { useCharacter } from '../../../../../context/character-context/character-context';
import { TabPanelItem } from '../../../../simple-tabs/tab-panel-item';

const StyledTabPanelItem = styled(TabPanelItem)`
    position: relative;
`;

const BackgroundImage = styled.div<{ src: string }>`
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    width: 100%;
    height: 100%;
    background-image: ${({ src }) => `url('${src}')`};
    background-position: right;
    background-repeat: no-repeat;
    opacity: 0.15;
`;

export function CharacterBackgroundPanel() {
    const { character } = useCharacter();

    const background = useMemo(() => character.getBackground(), [character]);

    if (!background) {
        return null;
    }

    const imageContainerRef = useRef<HTMLDivElement>(null);

    return (
        <StyledTabPanelItem
            component={Paper}
            componentProps={{ elevation: 2 }}
            ref={imageContainerRef}
        >
            {background.image && (
                <BackgroundImage
                    src={WeaveImages.getPath(
                        background.image,
                        imageContainerRef,
                    )}
                />
            )}
            <Typography
                variant="h6"
                style={{ position: 'relative', zIndex: 1 }}
            >
                Background: {background.name}
            </Typography>
        </StyledTabPanelItem>
    );
}
