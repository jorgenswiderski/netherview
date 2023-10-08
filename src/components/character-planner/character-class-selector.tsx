import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { BeatLoader } from 'react-spinners';
import { WeaveApi } from '../../api/weave';
import { CharacterEvents } from '../../models/character/types';
import { CharacterWidgetProps } from './types';

const ClassSelect = styled.select`
    padding: 10px 15px;
    font-size: 1rem;
`;

export default function ClassSelector({ onEvent }: CharacterWidgetProps) {
    const [classes, setClasses] = useState<any>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchClasses() {
            const response = await WeaveApi.getClassesInfo();
            setClasses(Object.values(response));
            setLoading(false);
        }

        fetchClasses();
    }, []);

    return loading ? (
        <BeatLoader />
    ) : (
        <ClassSelect
            onChange={(e) => onEvent(CharacterEvents.ADD_LEVEL, e.target.value)}
        >
            {classes.map((cls: any) => (
                <option key={cls.name} value={cls.name.toLowerCase()}>
                    {cls.name}
                </option>
            ))}
        </ClassSelect>
    );
}
