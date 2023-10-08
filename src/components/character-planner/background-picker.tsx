import React, { useState, useEffect } from 'react';
import { BackgroundInfo, BackgroundsInfo } from '../../api/weave/types';
import { WeaveApi } from '../../api/weave/weave';
import { CharacterWidgetProps } from './types';
import { CharacterEvents } from '../../models/character/types';
import { Picker } from './picker-card';

export default function BackgroundPicker({ onEvent }: CharacterWidgetProps) {
    const [backgrounds, setBackgrounds] = useState<BackgroundsInfo>({});
    const [selectedBackground, setSelectedBackground] =
        useState<BackgroundInfo | null>();

    useEffect(() => {
        async function fetchBackgrounds() {
            const data = await WeaveApi.getBackgroundsInfo();
            setBackgrounds(data);
        }

        fetchBackgrounds();
    }, []);

    const handleBackgroundSelect = (background: BackgroundInfo) => {
        setSelectedBackground(background);
    };

    const handleConfirm = () => {
        if (selectedBackground) {
            onEvent(CharacterEvents.SET_BACKGROUND, selectedBackground);
        }
    };

    return (
        <>
            <Picker.Grid>
                {Object.entries(backgrounds).map(([key, background]) => (
                    <Picker.Card
                        key={key}
                        isSelected={background === selectedBackground}
                        onClick={() => handleBackgroundSelect(background)}
                        title={background.name}
                    >
                        <img src={background.image} alt={background.name} />
                        <p>{background.name}</p>
                    </Picker.Card>
                ))}
            </Picker.Grid>

            {selectedBackground && (
                <Picker.Description>
                    <strong>Description:</strong>{' '}
                    {selectedBackground.description}
                    <br />
                    <strong>Skills:</strong>{' '}
                    {selectedBackground.skills.join(', ')}
                </Picker.Description>
            )}

            <Picker.ConfirmButton onClick={handleConfirm}>
                Confirm Selection
            </Picker.ConfirmButton>
        </>
    );
}
