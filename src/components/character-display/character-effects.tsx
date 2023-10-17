import React, { useMemo } from 'react';
import { Character } from '../../models/character/character';
import GrantedEffect from '../character-planner/feature-picker/prospective-effects/granted-effect';
import { CollapsibleSection } from './collapsible-section';

interface CharacterEffectsProps {
    character: Character;
}

export function CharacterEffects({ character }: CharacterEffectsProps) {
    const actions = useMemo(() => character.getActions(), [character]);
    const characteristics = useMemo(
        () => character.getCharacteristics(),
        [character],
    );
    const proficiencies = useMemo(
        () => character.getProficiencies(),
        [character],
    );

    const sections = [
        { title: 'Actions', content: actions },
        { title: 'Characteristics', content: characteristics },
        { title: 'Proficiencies', content: proficiencies },
    ];

    return (
        <>
            {sections.map(
                (section) =>
                    section.content.length > 0 && (
                        <CollapsibleSection
                            key={section.title}
                            title={section.title}
                            elevation={2}
                            style={{
                                minWidth: '250px',
                                flex: 1,
                            }}
                            content={section.content
                                .filter((effect) => !effect.hidden)
                                .map((effect) => (
                                    <GrantedEffect
                                        key={effect.name}
                                        effect={effect}
                                        elevation={4}
                                    />
                                ))}
                        />
                    ),
            )}
        </>
    );
}
