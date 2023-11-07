import React, { useMemo } from 'react';
import styled from '@emotion/styled';
import { ActionEffectType } from '@jorgenswiderski/tomekeeper-shared/dist/types/grantable-effect';
import { ISpell } from '@jorgenswiderski/tomekeeper-shared/dist/types/action';
import { useCharacter } from '../../../context/character-context/character-context';
import { TabPanel } from '../../simple-tabs/tab-panel';
import { TabPanelProps } from '../../simple-tabs/types';
import { GrantedEffect } from '../../character-planner/feature-picker/prospective-effects/granted-effect';
import { SpellsByLevel } from '../../spells-by-level';

const ContentSection = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: stretch;
    min-width: 100%;
    gap: 1rem;
    flex: 1;
    overflow-y: hidden;

    @media (max-width: 768px) {
        width: 100%;
        box-sizing: border-box;
        flex-direction: column;
        overflow-y: unset;
    }
`;

// const Column = styled.div`
//     display: flex;
//     flex-direction: column;
//     gap: 1rem;

//     height: 100%;
//     overflow-y: auto;

//     flex: 1;

//     @media (max-width: 768px) {
//         align-items: stretch;
//         overflow-y: unset;
//     }
// `;

interface ActionsTabProps extends TabPanelProps {}

export function ActionsTab({ ...panelProps }: ActionsTabProps) {
    const { character } = useCharacter();

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

    return (
        <TabPanel {...panelProps}>
            <ContentSection>
                <SpellsByLevel
                    spells={spells.map((spell) => spell.action as ISpell)}
                />
                {actions.map((action) => (
                    <GrantedEffect effect={action} elevation={2} />
                ))}
            </ContentSection>
        </TabPanel>
    );
}
