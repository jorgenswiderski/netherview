// character-class-selector.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { WeaveApi } from '../../api/weave';

const ClassSelect = styled.select`
    padding: 10px 15px;
    font-size: 1rem;
`;

interface Props {
    onAddClass: (selectedClass: string) => void;
}

export default function ClassSelector({ onAddClass }: Props) {
    const [classes, setClasses] = useState<any>([]);

    useEffect(() => {
        async function fetchClasses() {
            const response = await WeaveApi.getClassesInfo();
            setClasses(Object.values(response));
        }

        fetchClasses();
    }, []);

    return (
        <ClassSelect onChange={(e) => onAddClass(e.target.value)}>
            {classes.map((cls: any) => (
                <option key={cls.name} value={cls.name.toLowerCase()}>
                    {cls.name}
                </option>
            ))}
        </ClassSelect>
    );
}
