import React, { useState, useMemo, useCallback, useEffect } from 'react';
import styled from '@emotion/styled';
import { ICharacterOption } from '@jorgenswiderski/tomekeeper-shared/dist/types/character-feature-customization-option';
import { Paper, Box, Typography } from '@mui/material';
import { ISpell } from '@jorgenswiderski/tomekeeper-shared/dist/types/action';
import { ICharacter } from '../../models/character/types';
import { PlannerHeader } from './planner-header/planner-header';
import { SpellIconCard } from '../icon-cards/spell-icon-card';
import { SpellsByLevel } from '../spells-by-level';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    flex: 1;
    width: 100%;
    align-items: center;
    gap: 1rem;
`;

const RowInnerBox = styled(Box)`
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    flex-wrap: wrap;
    flex: 1;
`;

const SelectedBoxPaper = styled(Paper)`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    box-sizing: border-box;
    padding: 1rem;
    gap: 0.5rem;
`;

interface SelectedSpellsProps {
    spells: ISpell[];
    numSpells: number;
    onClick: (spell: ISpell) => void;
}

function SelectedSpells({ spells, numSpells, onClick }: SelectedSpellsProps) {
    return (
        <SelectedBoxPaper elevation={2}>
            <Typography>
                {`Select ${numSpells > 1 ? numSpells : 'a'} spell${
                    numSpells > 1 ? 's' : ''
                } to learn.`}
            </Typography>
            <RowInnerBox>
                {Array.from({ length: numSpells }).map((_, idx) => {
                    const spell = spells[idx];

                    return (
                        <SpellIconCard
                            // eslint-disable-next-line react/no-array-index-key
                            key={idx}
                            spell={spell}
                            selected={spells.includes(spell)}
                            onClick={() => onClick(spell)}
                        />
                    );
                })}
            </RowInnerBox>
        </SelectedBoxPaper>
    );
}

// using 'any' here to resolve cyclic dependency with character-states.tsx
interface SpellPickerProps {
    title: string;
    onDecision: (decision: any, value: ICharacterOption[]) => void;
    decision: any;
    character: ICharacter;
}

export function SpellPicker({
    title,
    onDecision,
    decision,
    character,
}: SpellPickerProps) {
    const numSpells = decision.count;

    const [selectedSpells, setSelectedSpells] = useState<ISpell[]>([]);

    const spells = useMemo(() => {
        return decision.options.flatMap((option: ICharacterOption) => {
            const spell = character.spellData.find(
                (spell2) => spell2.name === option.name,
            );

            if (!spell) {
                throw new Error(`could not find spell ${option.name}`);
            }

            return spell!;
        });
    }, [decision.options]);

    const options = useMemo(
        () =>
            selectedSpells.map(
                (spell) =>
                    decision.options.find(
                        (opt: ICharacterOption) => opt.name === spell.name,
                    )!,
            ),
        [selectedSpells],
    );

    const handleSpellClick = (spell: ISpell) => {
        if (selectedSpells.includes(spell)) {
            setSelectedSpells((oldSpells) =>
                oldSpells.filter((s) => s !== spell),
            );
        } else if (selectedSpells.length === numSpells) {
            setSelectedSpells((oldSpells) => [
                ...oldSpells.slice(1, numSpells),
                spell,
            ]);
        } else {
            setSelectedSpells((oldSpells) => [...oldSpells, spell]);
        }
    };

    const handleConfirm = useCallback(() => {
        onDecision(decision, options);
    }, [options]);

    useEffect(() => setSelectedSpells([]), [decision]);

    return (
        <>
            <PlannerHeader
                title={title}
                onButtonClick={handleConfirm}
                buttonDisabled={selectedSpells.length !== numSpells}
            />

            <Container>
                <SelectedSpells
                    spells={selectedSpells}
                    numSpells={numSpells}
                    onClick={handleSpellClick}
                />

                <SpellsByLevel
                    spells={spells}
                    selectedSpells={selectedSpells}
                    onClick={handleSpellClick}
                />
            </Container>
        </>
    );
}
