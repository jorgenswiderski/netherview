import React, { useState, useMemo, useCallback, useEffect } from 'react';
import styled from '@emotion/styled';
import { ICharacterOption } from 'planner-types/src/types/character-feature-customization-option';
import {
    Card,
    CardActionArea,
    Button,
    Paper,
    Box,
    Typography,
    CardMedia,
} from '@mui/material';
import { ISpell } from 'planner-types/src/types/spell';
import { ICharacter } from '../../models/character/types';
import { Utils } from '../../models/utils';
import { SpellTooltip } from '../tooltips/spell-tooltip';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    flex: 1;
    width: 100%;
    align-items: center;
    gap: 1rem;
`;

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

const ButtonContainer = styled.div`
    text-align: center;
    margin: 10px 0 0;
    width: 100%;
`;

const NextButton = styled(Button)`
    @media (max-width: 600px) {
        width: 100%;
    }
`;

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

// const DescriptionPaper = styled(Paper)`
//     padding: 0.5rem;
// `;

const SelectedBoxPaper = styled(Paper)`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    box-sizing: border-box;
    padding: 1rem;
    gap: 0.5rem;
`;

const RowLabel = styled(Typography)`
    ${Utils.textShadow}
`;

interface SpellCardProps {
    selected: boolean;
    spell?: ISpell;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
}

function SpellCard({ selected, spell, onClick }: SpellCardProps) {
    return (
        <SpellTooltip action={spell}>
            <StyledCard elevation={3} selected={selected}>
                <ActionArea onClick={spell && onClick}>
                    {spell?.image && (
                        <CardMedia component="img" image={spell.image} />
                    )}
                </ActionArea>
            </StyledCard>
        </SpellTooltip>
    );
}

// using 'any' here to resolve cyclic dependency with character-states.tsx
interface SpellPickerProps {
    onDecision: (decision: any, value: ICharacterOption[]) => void;
    decision: any;
    character: ICharacter;
}

export default function SpellPicker({
    onDecision,
    decision,
    character,
}: SpellPickerProps) {
    const numSpells = decision.count;

    const [selectedSpells, setSelectedSpells] = useState<ISpell[]>([]);

    const spellsByLevel = useMemo(() => {
        const groupedSpells: ISpell[][] = [];

        decision.options.forEach((option: ICharacterOption) => {
            const spell = character.spellData.find(
                (spell2) => spell2.name === option.name,
            );

            if (!spell) {
                throw new Error(`could not find spell ${option.name}`);
            }

            if (!groupedSpells[spell.level]) {
                groupedSpells[spell.level] = [];
            }

            groupedSpells[spell.level].push(spell);
        });

        return groupedSpells;
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
            setSelectedSpells((spells) => spells.filter((s) => s !== spell));
        } else if (selectedSpells.length === numSpells) {
            setSelectedSpells((spells) => [
                ...spells.slice(1, numSpells),
                spell,
            ]);
        } else {
            setSelectedSpells((spells) => [...spells, spell]);
        }
    };

    const handleConfirm = useCallback(() => {
        onDecision(decision, options);
    }, [options]);

    useEffect(() => setSelectedSpells([]), [decision]);

    const romanNumerals = ['0', 'I', 'II', 'III', 'IV', 'V', 'VI'];

    // const showEffects =
    //     options.flatMap((option) => option?.grants).length > 0 ||
    //     options.flatMap((option) => option?.choices).length > 0;

    return (
        <>
            <Container>
                <SelectedBoxPaper elevation={2}>
                    <Typography>
                        {`Select ${numSpells > 1 ? numSpells : 'a'} spell${
                            numSpells > 1 ? 's' : ''
                        } to learn.`}
                    </Typography>
                    <RowInnerBox>
                        {Array.from({ length: numSpells }).map((_, idx) => {
                            const spell = selectedSpells[idx];

                            return (
                                <SpellCard
                                    spell={spell}
                                    selected={selectedSpells.includes(spell)}
                                    onClick={() => handleSpellClick(spell)}
                                />
                            );
                        })}
                    </RowInnerBox>
                </SelectedBoxPaper>
                {spellsByLevel.map((levelSpells, idx) => (
                    <RowOuterBox elevation={2}>
                        <RowLabel
                            variant="h5"
                            style={{
                                width: '2rem',
                                padding: '0 1.5rem',
                                textAlign: 'center',
                            }}
                        >
                            {romanNumerals[idx]}
                        </RowLabel>
                        <RowInnerBox>
                            {levelSpells.map((spell) => (
                                <SpellCard
                                    spell={spell}
                                    selected={selectedSpells.includes(spell)}
                                    onClick={() => handleSpellClick(spell)}
                                />
                            ))}
                        </RowInnerBox>
                    </RowOuterBox>
                ))}
            </Container>

            <ButtonContainer>
                <NextButton
                    variant="contained"
                    color="primary"
                    onClick={() => handleConfirm()}
                    disabled={selectedSpells.length !== numSpells}
                    fullWidth
                >
                    Next
                </NextButton>
            </ButtonContainer>
        </>
    );
}
