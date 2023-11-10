import React, { useMemo } from 'react';
import styled from '@emotion/styled';
import { TabPanel } from '../../../simple-tabs/tab-panel';
import { TabPanelProps } from '../../../simple-tabs/types';
import { useCharacter } from '../../../../context/character-context/character-context';
import { GrantedEffects } from '../../../character-planner/feature-picker/prospective-effects/granted-effects';

const StyledTabPanel = styled(TabPanel)``;

interface CharacteristicsTabProps extends TabPanelProps {}

export function CharacteristicsTab({ ...panelProps }: CharacteristicsTabProps) {
    const { character } = useCharacter();

    const characteristics = useMemo(
        () => character.getCharacteristics(),
        [character],
    );

    return (
        <StyledTabPanel {...panelProps}>
            <GrantedEffects effects={characteristics} flex />
        </StyledTabPanel>
    );
}
