// race-picker.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { WeaveApi } from '../../api/weave';
import { CharacterEvents } from '../../models/character/types';
import { CharacterWidgetProps } from './types';

const RaceSelect = styled.select`
    padding: 10px 15px;
    font-size: 1rem;
`;

export default function RacePicker({ onEvent }: CharacterWidgetProps) {
    const [races, setRaces] = useState<any>([]);

    useEffect(() => {
        async function fetchClasses() {
            const response = await WeaveApi.getRacesInfo();
            setRaces(Object.values(response));
        }

        fetchClasses();
    }, []);

    return (
        <RaceSelect
            onChange={(e) => onEvent(CharacterEvents.SET_RACE, e.target.value)}
        >
            {races.map((race: any) => (
                <option key={race.name} value={race.name.toLowerCase()}>
                    {race.name}
                </option>
            ))}
        </RaceSelect>
    );
}
