import React, { useMemo, useState } from 'react';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableRow,
    TableCell,
    Button,
} from '@mui/material';
import styled from '@emotion/styled';
import { AbilityScores } from '../../../models/character/types';
import { AbilitiesBonusType, AbilitiesCostMode } from './types';
import { PlannerHeader } from '../planner-header/planner-header';

const MainBox = styled(Box)`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: stretch;
    gap: 1rem;

    flex: 1;

    height: 100%;
    width: 100%;
    overflow: hidden;
`;

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

interface AbilitiesUIProps {
    title: string;
    baseAbilities?: AbilityScores;
    abilities?: AbilityScores;
    pointsAvailable?: number;
    costMode: AbilitiesCostMode;
    onDecision: (decision: AbilityScores) => void;
    bonuses?: Record<AbilitiesBonusType, Partial<AbilityScores>>;
    scoreLimit?: number;
    dots?: number;
    children?: React.ReactNode;
    abilityOptions?: (keyof AbilityScores)[];
}

export function AbilitiesUI({
    title,
    baseAbilities = {
        Strength: 8,
        Dexterity: 8,
        Constitution: 8,
        Intelligence: 8,
        Wisdom: 8,
        Charisma: 8,
    },
    abilities,
    pointsAvailable = 27,
    costMode,
    onDecision,
    bonuses,
    scoreLimit = 15,
    dots = 17,
    children,
    abilityOptions,
}: AbilitiesUIProps) {
    const [currentAbilities, setCurrentAbilities] = useState<AbilityScores>(
        abilities ?? baseAbilities,
    );

    const pointsSpent = useMemo(() => {
        let totalSpent = 0;

        Object.entries(currentAbilities).forEach(([ability, score]) => {
            if (score <= 13 || costMode === AbilitiesCostMode.CONSTANT) {
                totalSpent +=
                    score - baseAbilities[ability as keyof AbilityScores]; // Each point costs 1 point
            } else {
                totalSpent +=
                    13 -
                    baseAbilities[ability as keyof AbilityScores] +
                    2 * (score - 13); // 5 points for the first 5 scores, then 2 points for each score above 13
            }
        });

        return totalSpent;
    }, [currentAbilities]);

    const canIncrease = (ability: keyof AbilityScores) => {
        const score = currentAbilities[ability];

        const cost =
            score >= 13 && costMode === AbilitiesCostMode.INCREMENTAL ? 2 : 1;

        return (
            pointsSpent + cost <= pointsAvailable &&
            score < scoreLimit &&
            (!abilityOptions || abilityOptions.includes(ability))
        );
    };

    const canDecrease = (ability: keyof AbilityScores) =>
        currentAbilities[ability] > baseAbilities[ability];

    const handleIncrease = (ability: keyof AbilityScores) => {
        if (!canIncrease(ability)) {
            return;
        }

        setCurrentAbilities({
            ...currentAbilities,
            [ability]: currentAbilities[ability] + 1,
        });
    };

    const handleDecrease = (ability: keyof AbilityScores) => {
        if (!canDecrease(ability)) {
            return;
        }

        setCurrentAbilities({
            ...currentAbilities,
            [ability]: currentAbilities[ability] - 1,
        });
    };

    const handleConfirm = () => {
        if (costMode === AbilitiesCostMode.CONSTANT) {
            const netScores = Object.fromEntries(
                Object.entries(currentAbilities).map(([ability, score]) => [
                    ability,
                    score - baseAbilities[ability as keyof AbilityScores],
                ]),
            ) as unknown as AbilityScores;

            onDecision(netScores);
        } else {
            onDecision(currentAbilities);
        }
    };

    const getAbilityBonuses = (
        ability: keyof AbilityScores,
    ): Record<AbilitiesBonusType, number> => {
        return Object.fromEntries(
            Object.entries(bonuses ?? {}).map(([type, bonus]) => [
                type,
                bonus[ability] ?? 0,
            ]),
        ) as Record<AbilitiesBonusType, number>;
    };

    const getAbilityBonusTotal = (ability: keyof AbilityScores): number => {
        return Object.values(getAbilityBonuses(ability)).reduce(
            (acc, v) => acc + v,
            0,
        );
    };

    const isButtonEnabled = pointsSpent === pointsAvailable;

    return (
        <MainBox>
            <PlannerHeader
                title={title}
                onButtonClick={handleConfirm}
                buttonDisabled={!isButtonEnabled}
            />

            <Box style={{ flex: 1, overflow: 'hidden' }}>
                <Typography variant="h6">
                    Points Used: {pointsSpent} / {pointsAvailable}
                </Typography>

                <Table sx={{ userSelect: 'none' }}>
                    <TableBody>
                        {Object.keys(currentAbilities).map((abilityString) => {
                            const ability: keyof AbilityScores =
                                abilityString as keyof AbilityScores;

                            const score = currentAbilities[ability];

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
                                                disabled={!canDecrease(ability)}
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
                                                    {score +
                                                        getAbilityBonusTotal(
                                                            ability,
                                                        )}
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
                                                disabled={!canIncrease(ability)}
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
                                                {Array.from({
                                                    length: dots,
                                                }).map((_, index) => (
                                                    <Dot
                                                        // eslint-disable-next-line react/no-array-index-key
                                                        key={index}
                                                        filled={index < score}
                                                        racialBonus={
                                                            index >= score &&
                                                            index <
                                                                score +
                                                                    getAbilityBonusTotal(
                                                                        ability,
                                                                    )
                                                        }
                                                    />
                                                ))}
                                            </Box>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>

                {children}
            </Box>
        </MainBox>
    );
}
