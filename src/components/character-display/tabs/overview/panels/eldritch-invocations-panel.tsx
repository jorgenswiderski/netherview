import React, { useEffect, useMemo } from 'react';
import { Paper } from '@mui/material';
import { useCharacter } from '../../../../../context/character-context/character-context';
import { TabPanelItem } from '../../../../simple-tabs/tab-panel-item';
import { GrantedEffects } from '../../../../character-planner/feature-picker/prospective-effects/granted-effects';
import {
    CharacterTreeDecision,
    CharacterTreeEffect,
} from '../../../../../models/character/character-tree-node/character-tree';
import { log } from '../../../../../models/logger';

export function EldritchInvocationsPanel() {
    const { character } = useCharacter();

    const invocations = useMemo(
        () =>
            character
                .getPassives()
                .filter((effect) => !effect.hidden)
                .filter(
                    (effect) =>
                        (
                            (effect as unknown as CharacterTreeEffect)
                                .parent as CharacterTreeDecision | undefined
                        )?.parent?.name === 'Eldritch Invocation',
                ),
        [character],
    );

    useEffect(() => {
        character.getPassives().forEach(log);
    }, [character]);

    if (invocations.length === 0) {
        return null;
    }

    return (
        <TabPanelItem
            label="Eldritch Invocations"
            component={Paper}
            componentProps={{ elevation: 2 }}
        >
            <GrantedEffects effects={invocations} elevation={3} flex />
        </TabPanelItem>
    );
}
