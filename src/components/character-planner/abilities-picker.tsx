// abilities-picker.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { CharacterWidgetProps } from './types';
import { AbilityScores, CharacterEvents } from '../../models/character/types';

const AbilitiesTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    color: #e0e0e0; // Light gray for text
    background-color: #2a2a2a; // Base dark gray
`;

const AbilityRow = styled.tr`
    border-bottom: 1px solid #444;
    &:last-child {
        border-bottom: 0;
    }
`;

const AbilityCell = styled.td`
    padding: 10px;
    vertical-align: middle;
    font-size: 1.25rem;
`;

const AbilityButton = styled.button`
    margin: 5px;
    background-color: #1a1a1a;
    color: #e0e0e0;
    border: 1px solid #8a8a8a;
    transition:
        background-color 0.3s,
        opacity 0.3s;

    &:hover {
        background-color: #333;
    }

    &:disabled {
        background-color: #1a1a1a;
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const DotContainer = styled.div`
    display: flex;
    gap: 3px;
`;

const Dot = styled.div<{ filled: boolean; bonus: boolean }>`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${({ filled, bonus }) =>
        // eslint-disable-next-line no-nested-ternary
        filled ? (bonus ? '#9f9' : '#e0e0e0') : 'transparent'};
    border: 1px solid ${({ bonus }) => (bonus ? '#9f9' : '#e0e0e0')};
`;

const ScoreContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
`;

const ConfirmButton = styled.button`
    margin-top: 20px;
    padding: 10px 15px;
    font-size: 1rem;
    background-color: #1a1a1a;
    color: #e0e0e0;
    border: 1px solid #8a8a8a;
    transition:
        background-color 0.3s,
        opacity 0.3s;

    &:hover {
        background-color: #333;
    }

    &:disabled {
        background-color: #1a1a1a;
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

export default function AbilitiesPicker({ onEvent }: CharacterWidgetProps) {
    const TOTAL_POINTS = 27;
    const [pointsLeft, setPointsLeft] = useState(TOTAL_POINTS);
    const [abilities, setAbilities] = useState<AbilityScores>({
        Strength: 8,
        Dexterity: 8,
        Constitution: 8,
        Intelligence: 8,
        Wisdom: 8,
        Charisma: 8,
    });

    const [bonusTwo, setBonusTwo] = useState<string | null>(null);
    const [bonusOne, setBonusOne] = useState<string | null>(null);

    const canIncrease = (score: number) => {
        const cost = score < 13 ? 1 : 2;

        return pointsLeft >= cost && score < 15;
    };

    const canDecrease = (score: number) => score > 8;

    const handleIncrease = (ability: keyof AbilityScores) => {
        const cost = abilities[ability] < 13 ? 1 : 2;

        if (canIncrease(abilities[ability])) {
            setAbilities({
                ...abilities,
                [ability]: abilities[ability] + 1,
            });

            setPointsLeft(pointsLeft - cost);
        }
    };

    const handleDecrease = (ability: keyof AbilityScores) => {
        const refund = abilities[ability] <= 13 ? 1 : 2;

        if (canDecrease(abilities[ability])) {
            setAbilities({
                ...abilities,
                [ability]: abilities[ability] - 1,
            });

            setPointsLeft(pointsLeft + refund);
        }
    };

    const handleConfirm = () => {
        // Call the event with the abilities and the racial bonuses
        onEvent(CharacterEvents.SET_ABILITY_SCORES, {
            abilityScores: abilities,
            bonusTwo,
            bonusOne,
        });
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
            <h2>
                Points Used: {pointsSpent} / {TOTAL_POINTS}
            </h2>

            <AbilitiesTable>
                {Object.keys(abilities).map((abilityString) => {
                    const ability: keyof AbilityScores =
                        abilityString as keyof AbilityScores;
                    const score = abilities[ability];

                    return (
                        <AbilityRow key={ability}>
                            <AbilityCell>{ability}</AbilityCell>
                            <AbilityCell>
                                <ScoreContainer>
                                    <AbilityButton
                                        onClick={() => handleDecrease(ability)}
                                        disabled={
                                            !canDecrease(abilities[ability])
                                        }
                                    >
                                        -
                                    </AbilityButton>
                                    {score + getBonusDots(ability)}
                                    <AbilityButton
                                        onClick={() => handleIncrease(ability)}
                                        disabled={
                                            !canIncrease(abilities[ability])
                                        }
                                    >
                                        +
                                    </AbilityButton>
                                </ScoreContainer>
                            </AbilityCell>
                            <AbilityCell>
                                <DotContainer>
                                    {Array.from({ length: 17 }).map(
                                        (_, index) => (
                                            <Dot
                                                // eslint-disable-next-line react/no-array-index-key
                                                key={index}
                                                filled={
                                                    index <
                                                    score +
                                                        getBonusDots(ability)
                                                }
                                                bonus={
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
                                </DotContainer>
                            </AbilityCell>
                        </AbilityRow>
                    );
                })}
            </AbilitiesTable>

            <div>
                +2 Racial Bonus:
                <select
                    id="bonusTwo"
                    value={bonusTwo || ''}
                    onChange={(e) => {
                        setBonusTwo(e.target.value);
                    }}
                >
                    <option value="">Select Ability</option>
                    {Object.keys(abilities)
                        .filter((ability) => ability !== bonusOne)
                        .map((ability) => (
                            <option key={ability} value={ability}>
                                {ability}
                            </option>
                        ))}
                </select>
            </div>

            <div>
                +1 Racial Bonus:
                <select
                    id="bonusOne"
                    value={bonusOne || ''}
                    onChange={(e) => {
                        setBonusOne(e.target.value);
                    }}
                >
                    <option value="">Select Ability</option>
                    {Object.keys(abilities)
                        .filter((ability) => ability !== bonusTwo)
                        .map((ability) => (
                            <option key={ability} value={ability}>
                                {ability}
                            </option>
                        ))}
                </select>
            </div>

            <ConfirmButton onClick={handleConfirm} disabled={!isButtonEnabled}>
                Confirm
            </ConfirmButton>
        </div>
    );
}
