import React, { useState, useEffect } from 'react';
import { error } from '../models/logger';

export function HomePage() {
    const [data, setData] = useState<CharacterClassData[]>();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getCharacterClassList();
                setData(result);
            } catch (e) {
                error('Error fetching character class list:', e);
                // Handle the error as needed, maybe set some error state
            }
        };

        fetchData();
    }, []); // Empty dependency array means this useEffect runs once when the component mounts

    if (!data) {
        return <div>Loading...</div>; // or some other placeholder/loading indicator
    }

    return (
        <div>
            <h1>Character Classes</h1>
            <ul>
                {data.map((characterClass) => (
                    <li key={characterClass.pageid}>{characterClass.title}</li>
                ))}
            </ul>
        </div>
    );
}
