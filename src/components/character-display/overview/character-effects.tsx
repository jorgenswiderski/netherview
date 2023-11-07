import React, { useMemo } from 'react';
import { ActionEffectType } from '@jorgenswiderski/tomekeeper-shared/dist/types/grantable-effect';
import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { GrantedEffect } from '../../character-planner/feature-picker/prospective-effects/granted-effect';
import { CollapsibleSection } from '../../collapsible-section';
import { CharacterTreeActionBaseEffect } from '../../../models/character/character-tree-node/character-tree-action-base-effect';
import { useCharacter } from '../../../context/character-context/character-context';

const ItemBox = styled(Box)`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

export function CharacterEffects() {
    const { character } = useCharacter();

    const spells: CharacterTreeActionBaseEffect[] = useMemo(() => {
        return character
            .getActions()
            .filter(
                (action) => action.subtype === ActionEffectType.SPELL_ACTION,
            ) as unknown as CharacterTreeActionBaseEffect[];
    }, [character]);

    const actions = useMemo(() => {
        return character
            .getActions()
            .filter(
                (action) => action.subtype !== ActionEffectType.SPELL_ACTION,
            );
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
                                            key={`${effect.name}-${effect.description}`}
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
