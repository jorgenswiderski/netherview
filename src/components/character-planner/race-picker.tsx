import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { BeatLoader } from 'react-spinners';
import { WeaveApi } from '../../api/weave/weave';
import { CharacterEvents } from '../../models/character/types';
import { CharacterWidgetProps } from './types';
import { PickerCard, PickerGrid } from './picker-card';
import { RaceInfo } from '../../api/weave/types';
import { ICharacterFeatureCustomizationOption } from './choice-picker/types';

const ConfirmButton = styled.button`
    margin-top: 20px;
    padding: 10px 15px;
    font-size: 1rem;
    background-color: #2d2d2d;
    color: #e0e0e0;
    border: 1px solid #555;
    transition: background-color 0.2s;

    &:hover {
        background-color: #3a3a3a;
    }

    &:disabled {
        opacity: 0.5;
    }
`;

const Description = styled.p`
    margin-top: 15px;
    font-size: 1.1rem;
    color: #b0b0b0;
`;

enum Step {
    RACE = 'RACE',
    SUBRACE = 'SUBRACE',
}

export default function RacePicker({ onEvent }: CharacterWidgetProps) {
    const [races, setRaces] = useState<RaceInfo[]>([]);
    const [selectedRace, setSelectedRace] = useState<RaceInfo | null>(null);
    const [selectedSubrace, setSelectedSubrace] =
        useState<ICharacterFeatureCustomizationOption | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentStep, setCurrentStep] = useState<Step>(Step.RACE);

    useEffect(() => {
        async function fetchRaces() {
            const response = await WeaveApi.getRacesInfo();
            setRaces(Object.values(response));
            setLoading(false);
        }

        fetchRaces();
    }, []);

    const handleConfirm = () => {
        if (selectedRace) {
            onEvent(CharacterEvents.SET_RACE, {
                race: selectedRace,
                subrace: selectedSubrace,
            });
        }
    };

    const proceedToNextStep = () => {
        if (
            selectedRace &&
            !(selectedRace.choices && selectedRace.choices.length > 0)
        ) {
            handleConfirm();
        } else if (selectedRace && selectedRace.choices && selectedSubrace) {
            handleConfirm();
        } else if (selectedRace && selectedRace.choices) {
            setCurrentStep(Step.SUBRACE);
        }
    };

    return loading ? (
        <BeatLoader />
    ) : (
        <>
            <PickerGrid>
                {currentStep === Step.RACE &&
                    races.map((race) => (
                        <PickerCard
                            key={race.name}
                            isSelected={selectedRace?.name === race.name}
                            onClick={() => setSelectedRace(race)}
                        >
                            <img src={race.image} alt={race.name} />
                            <p>{race.name}</p>
                        </PickerCard>
                    ))}

                {currentStep === Step.SUBRACE &&
                    selectedRace?.choices?.map((subrace) => (
                        <PickerCard
                            key={subrace.name}
                            isSelected={selectedSubrace === subrace}
                            onClick={() => setSelectedSubrace(subrace)}
                        >
                            <p>{subrace.name}</p>
                        </PickerCard>
                    ))}
            </PickerGrid>

            {currentStep === Step.RACE && selectedRace && (
                <Description>{selectedRace.description}</Description>
            )}
            {currentStep === Step.SUBRACE && selectedSubrace && (
                <Description>{selectedSubrace.description}</Description>
            )}

            <ConfirmButton
                onClick={proceedToNextStep}
                disabled={!selectedRace && !selectedSubrace}
            >
                Confirm
            </ConfirmButton>
        </>
    );
}
