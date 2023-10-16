// abilities-picker.tsx
import React, { useMemo, useState } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import { ICharacterOption } from 'planner-types/src/types/character-feature-customization-option';
import {
    GrantableEffectSubtype,
    GrantableEffectType,
} from 'planner-types/src/types/grantable-effect';
import { AbilityScores } from '../../models/character/types';

// using 'any' here to resolve cyclic dependency with character-states.tsx
interface CharacterWidgetProps {
    onDecision: (decision: any, value: ICharacterOption) => void;
    decision: any;
}

function Dot({
    filled,
    racialBonus,
}: {
    filled: boolean;
    racialBonus: boolean;
}) {
    return (
        <Box
            sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                // eslint-disable-next-line no-nested-ternary
                backgroundColor: racialBonus
                    ? '#99f'
                    : filled
                    ? '#e0e0e0'
                    : 'transparent',
                border: `1px solid ${racialBonus ? '#99f' : '#e0e0e0'}`,
                mr: 0.5,
                display: 'inline-block',
            }}
        />
    );
}

export default function AbilitiesPicker({
    onDecision: onEvent,
    decision,
}: CharacterWidgetProps) {
    const TOTAL_POINTS = 27;
    const [abilities, setAbilities] = useState<AbilityScores>({
        Strength: 15,
        Dexterity: 14,
        Constitution: 14,
        Intelligence: 8,
        Wisdom: 12,
        Charisma: 8,
    });

    const [bonusTwo, setBonusTwo] = useState<string | null>('Dexterity');
    const [bonusOne, setBonusOne] = useState<string | null>('Strength');

    const calculatePointsSpent = () => {
        let totalSpent = 0;

        Object.values(abilities).forEach((score) => {
            if (score <= 13) {
                totalSpent += score - 8; // Each point costs 1 point if the score is less than or equal to 13
            } else {
                totalSpent += 5 + 2 * (score - 13); // 5 points for the first 5 scores, then 2 points for each score above 13
            }
        });

        return totalSpent;
    };

    const pointsLeft = useMemo(
        () => TOTAL_POINTS - calculatePointsSpent(),
        [abilities],
    );

    const canIncrease = (score: number) => {
        const cost = score < 13 ? 1 : 2;

        return pointsLeft >= cost && score < 15;
    };

    const canDecrease = (score: number) => score > 8;

    const handleIncrease = (ability: keyof AbilityScores) => {
        if (!canIncrease(abilities[ability])) {
            return;
        }

        setAbilities({
            ...abilities,
            [ability]: abilities[ability] + 1,
        });
    };

    const handleDecrease = (ability: keyof AbilityScores) => {
        if (!canDecrease(abilities[ability])) {
            return;
        }

        setAbilities({
            ...abilities,
            [ability]: abilities[ability] - 1,
        });
    };

    const getBonusValue = (ability: string): number => {
        if (bonusOne === ability) {
            return 1;
        }

        return bonusTwo === ability ? 2 : 0;
    };

    const handleConfirm = () => {
        const choice: ICharacterOption = {
            name: 'Set Ability Scores',
            grants: [
                {
                    name: 'Base Ability Scores',
                    type: GrantableEffectType.CHARACTERISTIC,
                    subtype: GrantableEffectSubtype.ABILITY_BASE,
                    hidden: true,
                    values: { ...abilities },
                },
                {
                    name: 'Racial Ability Score Bonuses',
                    type: GrantableEffectType.CHARACTERISTIC,
                    subtype: GrantableEffectSubtype.ABILITY_RACIAL,
                    hidden: true,
                    values: Object.fromEntries(
                        Object.keys(abilities).map((ability) => [
                            ability,
                            getBonusValue(ability),
                        ]),
                    ),
                },
            ],
        };

        // Call the event with the abilities and the racial bonuses
        onEvent(decision, choice);
    };

    const getBonusDots = (ability: keyof AbilityScores) => {
        if (ability === bonusTwo) {
            return 2;
        }

        if (ability === bonusOne) {
            return 1;
        }

        return 0;
    };

    const pointsSpent = TOTAL_POINTS - pointsLeft;

    const isButtonEnabled =
        pointsSpent === TOTAL_POINTS && bonusOne && bonusTwo;

    return (
        <div>
            <Typography variant="h6">
                Points Used: {pointsSpent} / {TOTAL_POINTS}
            </Typography>

            <Table sx={{ userSelect: 'none' }}>
                <TableBody>
                    {Object.keys(abilities).map((abilityString) => {
                        const ability: keyof AbilityScores =
                            abilityString as keyof AbilityScores;
                        const score = abilities[ability];

                        return (
                            <TableRow key={ability}>
                                <TableCell>
                                    <Typography variant="h6">
                                        {ability}
                                    </Typography>{' '}
                                </TableCell>
                                <TableCell>
                                    <Box display="flex" alignItems="center">
                                        <Button
                                            variant="outlined"
                                            sx={{
                                                width: 40,
                                                minWidth: 'unset',
                                            }}
                                            onClick={() =>
                                                handleDecrease(ability)
                                            }
                                            disabled={
                                                !canDecrease(abilities[ability])
                                            }
                                        >
                                            -
                                        </Button>
                                        <Box
                                            mx={2}
                                            sx={{
                                                width: 24,
                                                textAlign: 'center',
                                            }}
                                        >
                                            {' '}
                                            <Typography>
                                                {score + getBonusDots(ability)}
                                            </Typography>
                                        </Box>
                                        <Button
                                            variant="outlined"
                                            sx={{
                                                width: 40,
                                                minWidth: 'unset',
                                            }}
                                            onClick={() =>
                                                handleIncrease(ability)
                                            }
                                            disabled={
                                                !canIncrease(abilities[ability])
                                            }
                                        >
                                            +
                                        </Button>
                                    </Box>
                                </TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                    <Box display="flex" alignItems="center">
                                        <Box
                                            mx={2}
                                            sx={{
                                                display: 'flex',
                                                flexWrap: 'nowrap',
                                            }}
                                        >
                                            {Array.from({ length: 17 }).map(
                                                (_, index) => (
                                                    <Dot
                                                        // eslint-disable-next-line react/no-array-index-key
                                                        key={index}
                                                        filled={index < score}
                                                        racialBonus={
                                                            index >= score &&
                                                            index <
                                                                score +
                                                                    getBonusDots(
                                                                        ability,
                                                                    )
                                                        }
                                                    />
                                                ),
                                            )}
                                        </Box>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>

            <Box mt={2}>
                <Typography>+2 Racial Bonus:</Typography>
                <Select
                    value={bonusTwo || ''}
                    onChange={(e) => setBonusTwo(e.target.value as string)}
                    fullWidth
                >
                    <MenuItem value="">
                        <em>Select Ability</em>
                    </MenuItem>
                    {Object.keys(abilities)
                        .filter((ability) => ability !== bonusOne)
                        .map((ability) => (
                            <MenuItem key={ability} value={ability}>
                                {ability}
                            </MenuItem>
                        ))}
                </Select>
            </Box>

            <Box mt={2}>
                <Typography>+1 Racial Bonus:</Typography>
                <Select
                    value={bonusOne || ''}
                    onChange={(e) => setBonusOne(e.target.value as string)}
                    fullWidth
                >
                    <MenuItem value="">
                        <em>Select Ability</em>
                    </MenuItem>
                    {Object.keys(abilities)
                        .filter((ability) => ability !== bonusTwo)
                        .map((ability) => (
                            <MenuItem key={ability} value={ability}>
                                {ability}
                            </MenuItem>
                        ))}
                </Select>
            </Box>

            <Box mt={3}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleConfirm}
                    disabled={!isButtonEnabled}
                    fullWidth
                >
                    Confirm
                </Button>
            </Box>
        </div>
    );
}
