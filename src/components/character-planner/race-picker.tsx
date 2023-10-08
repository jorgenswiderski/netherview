import React, { useState, useEffect } from 'react';
import { BeatLoader } from 'react-spinners';
import { WeaveApi } from '../../api/weave/weave';
import { CharacterEvents } from '../../models/character/types';
import { CharacterWidgetProps } from './types';
import { RaceInfo } from '../../api/weave/types';
import { ICharacterFeatureCustomizationOption } from './choice-picker/types';
import { Picker } from './picker-card';

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
            <Picker.Grid>
                {currentStep === Step.RACE &&
                    races.map((race) => (
                        <Picker.Card
                            key={race.name}
                            isSelected={selectedRace?.name === race.name}
                            onClick={() => setSelectedRace(race)}
                        >
                            <img src={race.image} alt={race.name} />
                            <p>{race.name}</p>
                        </Picker.Card>
                    ))}

                {currentStep === Step.SUBRACE &&
                    selectedRace?.choices?.map((subrace) => (
                        <Picker.Card
                            key={subrace.name}
                            isSelected={selectedSubrace === subrace}
                            onClick={() => setSelectedSubrace(subrace)}
                        >
                            <p>{subrace.name}</p>
                        </Picker.Card>
                    ))}
            </Picker.Grid>

            {currentStep === Step.RACE && selectedRace && (
                <Picker.Description>
                    {selectedRace.description}
                </Picker.Description>
            )}
            {currentStep === Step.SUBRACE && selectedSubrace && (
                <Picker.Description>
                    {selectedSubrace.description}
                </Picker.Description>
            )}

            <Picker.ConfirmButton
                onClick={proceedToNextStep}
                disabled={!selectedRace && !selectedSubrace}
            >
                Confirm
            </Picker.ConfirmButton>
        </>
    );
}
