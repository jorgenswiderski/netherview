import styled from '@emotion/styled';
import { ISpell } from '@jorgenswiderski/tomekeeper-shared/dist/types/action';
import { Box, Paper, Typography } from '@mui/material';
import React, { useMemo } from 'react';
import { Utils } from '../models/utils';
import { SpellIconCard } from './icon-cards/spell-icon-card';

const RowOuterBox = styled(Paper)`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    padding: 0.5rem;
    box-sizing: border-box;
`;

const RowInnerBox = styled(Box)`
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    flex-wrap: wrap;
    flex: 1;
`;

const RowLabel = styled(Typography)`
    ${Utils.textShadow}

    width: 2rem;
    padding: 0 1.5rem;
    text-align: center;

    @media (max-width: 768px) {
        padding: 0 0.5rem;
    }
`;

interface SpellsByLevelProps {
    spells: ISpell[];
    selectedSpells?: ISpell[];
    onClick?: (spell: ISpell) => void;
    elevation?: number;
}

export function SpellsByLevel({
    spells,
    selectedSpells,
    onClick,
    elevation = 2,
}: SpellsByLevelProps) {
    const spellsByLevel = useMemo(() => {
        const groupedSpells: ISpell[][] = [];

        spells.forEach((spell) => {
            if (!groupedSpells[spell.level]) {
                groupedSpells[spell.level] = [];
            }

            groupedSpells[spell.level].push(spell);
        });

        return groupedSpells;
    }, [spells]);

    const romanNumerals = ['0', 'I', 'II', 'III', 'IV', 'V', 'VI'];

    return spellsByLevel.map((levelSpells, idx) => (
        // eslint-disable-next-line react/no-array-index-key
        <RowOuterBox key={idx} elevation={elevation}>
            <RowLabel variant="h5">{romanNumerals[idx]}</RowLabel>
            <RowInnerBox>
                {levelSpells.map((spell) => (
                    <SpellIconCard
                        key={spell.id}
                        spell={spell}
                        selected={selectedSpells?.includes(spell)}
                        onClick={onClick ? () => onClick(spell) : undefined}
                        elevation={elevation + 1}
                    />
                ))}
            </RowInnerBox>
        </RowOuterBox>
    ));
}
