import React from 'react';
import styled from '@emotion/styled';
import { Paper, Typography } from '@mui/material';
import { ICharacterTreeDecision } from '../../models/character/character-tree-node/types';
import { Utils } from '../../models/utils';

interface CharacterBackgroundProps {
    background: ICharacterTreeDecision;
}

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

export default function CharacterBackground({
    background,
}: CharacterBackgroundProps) {
    return (
        <Paper elevation={2} style={{ padding: '1rem', position: 'relative' }}>
            {background.image && (
                <BackgroundImage
                    src={Utils.getMediaWikiImagePath(background.image)}
                />
            )}
            <Typography
                variant="h6"
                style={{ position: 'relative', zIndex: 1 }}
            >
                Background: {background.name}
            </Typography>
        </Paper>
    );
}
