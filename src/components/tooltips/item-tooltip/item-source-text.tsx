import React from 'react';
import { Typography, TypographyProps } from '@mui/material';
import { ItemSource } from '@jorgenswiderski/tomekeeper-shared/dist/types/item-sources';

interface ItemSourceTextProps extends TypographyProps {
    sources: ItemSource[];
}

export function ItemSourceText({ sources, ...rest }: ItemSourceTextProps) {
    return (
        <Typography {...rest}>
            {sources.slice(0, 1).map(({ location, character }) => {
                let locationStr = `${location.act.name}`;

                if (location.location || location.region) {
                    locationStr += `, ${
                        location.location?.name ?? location.region?.name
                    }`;
                }

                if (character) {
                    return (
                        <>
                            {character.name}
                            <span>{` (${locationStr})`}</span>
                        </>
                    );
                }

                return <span>{locationStr}</span>;
            })}
        </Typography>
    );
}
