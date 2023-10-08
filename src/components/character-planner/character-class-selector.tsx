import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { BeatLoader } from 'react-spinners';
import { WeaveApi } from '../../api/weave/weave';
import { CharacterEvents } from '../../models/character/types';
import { CharacterWidgetProps } from './types';
import { Picker } from './picker-card';

const ConfirmButton = styled.button`
    margin-top: 20px;
    padding: 10px 15px;
    font-size: 1rem;
`;

export default function ClassSelector({ onEvent }: CharacterWidgetProps) {
    const [classes, setClasses] = useState<any>([]);
    const [selectedClass, setSelectedClass] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchClasses() {
            const response = await WeaveApi.getClassesInfo();
            setClasses(Object.values(response));
            setLoading(false);
        }

        fetchClasses();
    }, []);

    const handleClassSelection = (cls: any) => {
        setSelectedClass(cls.name);
    };

    const handleConfirm = () => {
        if (selectedClass) {
            onEvent(CharacterEvents.ADD_LEVEL, selectedClass);
        }
    };

    return loading ? (
        <BeatLoader />
    ) : (
        <>
            <Picker.Grid>
                {classes.map((cls: any) => (
                    <Picker.Card
                        key={cls.name}
                        isSelected={selectedClass === cls.name}
                        onClick={() => handleClassSelection(cls)}
                    >
                        <img src={cls.image} alt={cls.name} />
                        <p>{cls.name}</p>
                    </Picker.Card>
                ))}
            </Picker.Grid>
            <ConfirmButton onClick={handleConfirm} disabled={!selectedClass}>
                Confirm
            </ConfirmButton>
        </>
    );
}
