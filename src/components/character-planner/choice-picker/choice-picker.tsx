import React, { useState } from 'react';
import styled from 'styled-components';
import { ICharacterFeatureCustomizationOption } from './types';

const ChoiceContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const ChoiceButton = styled.button`
    padding: 10px 15px;
    border: 1px solid #ccc;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: #f1f1f1;
    }

    &.selected {
        background-color: #ddd;
    }
`;

interface ChoicePickerProps {
    choices: ICharacterFeatureCustomizationOption[];
    onChoiceSelected: (choice: ICharacterFeatureCustomizationOption) => void;
}

export default function ChoicePicker({
    choices,
    onChoiceSelected,
}: ChoicePickerProps) {
    const [selectedChoice, setSelectedChoice] =
        useState<ICharacterFeatureCustomizationOption | null>(null);

    const handleChoiceSelection = (
        choice: ICharacterFeatureCustomizationOption,
    ) => {
        setSelectedChoice(choice);
        onChoiceSelected(choice);
    };

    return (
        <ChoiceContainer>
            {choices.map((choice) => (
                <ChoiceButton
                    key={choice.name}
                    onClick={() => handleChoiceSelection(choice)}
                    className={choice === selectedChoice ? 'selected' : ''}
                >
                    {choice.name}
                </ChoiceButton>
            ))}
        </ChoiceContainer>
    );
}
