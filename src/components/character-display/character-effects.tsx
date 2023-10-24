import React, { useMemo } from 'react';
import { ActionEffectType } from 'planner-types/src/types/grantable-effect';
import styled from '@emotion/styled';
import Box from '@mui/material/Box';
import { Character } from '../../models/character/character';
import GrantedEffect from '../character-planner/feature-picker/prospective-effects/granted-effect';
import { CollapsibleSection } from './collapsible-section';

const ItemBox = styled(Box)`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

interface CharacterEffectsProps {
    character: Character;
}

export function CharacterEffects({ character }: CharacterEffectsProps) {
    const [spells, actions] = useMemo(() => {
        const allActions = character.getActions();

        return [
            allActions.filter(
                (action) => action.subtype === ActionEffectType.SPELL_ACTION,
            ),
            allActions.filter(
                (action) => action.subtype !== ActionEffectType.SPELL_ACTION,
            ),
        ];
    }, [character]);
    const characteristics = useMemo(
        () => character.getCharacteristics(),
        [character],
    );
    const proficiencies = useMemo(
        () => character.getProficiencies(),
        [character],
    );

    const sections = [
        { title: 'Spells Known', content: spells },
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
                                // flex: 1,
                            }}
                        >
                            <ItemBox>
                                {section.content
                                    .filter((effect) => !effect.hidden)
                                    .map((effect) => (
                                        <GrantedEffect
                                            effect={effect}
                                            elevation={4}
                                        />
                                    ))}
                            </ItemBox>
                        </CollapsibleSection>
                    ),
            )}
        </>
    );
}
