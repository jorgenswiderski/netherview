import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { BeatLoader } from 'react-spinners';
import { WeaveApi } from '../../api/weave';
import { CharacterEvents } from '../../models/character/types';
import { CharacterWidgetProps } from './types';
import { PickerCard, PickerGrid } from './picker-card';

const ConfirmButton = styled.button`
    margin-top: 20px;
    padding: 10px 15px;
    font-size: 1rem;
`;

export default function RacePicker({ onEvent }: CharacterWidgetProps) {
    const [races, setRaces] = useState<any>([]);
    const [selectedRace, setSelectedRace] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchRaces() {
            const response = await WeaveApi.getRacesInfo();
            setRaces(Object.values(response));
            setLoading(false);
        }

        fetchRaces();
    }, []);

    const handleRaceSelection = (race: any) => {
        setSelectedRace(race.name);
    };

    const handleConfirm = () => {
        if (selectedRace) {
            onEvent(CharacterEvents.SET_RACE, selectedRace);
        }
    };

    return loading ? (
        <BeatLoader />
    ) : (
        <>
            <PickerGrid>
                {races.map((race: any) => (
                    <PickerCard
                        key={race.name}
                        isSelected={selectedRace === race.name}
                        onClick={() => handleRaceSelection(race)}
                    >
                        <img src={race.image} alt={race.name} />
                        <p>{race.name}</p>
                    </PickerCard>
                ))}
            </PickerGrid>
            <ConfirmButton onClick={handleConfirm} disabled={!selectedRace}>
                Confirm
            </ConfirmButton>
        </>
    );
}
