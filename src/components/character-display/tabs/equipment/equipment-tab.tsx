import React, { useMemo, useState } from 'react';
import styled from '@emotion/styled';
import { Box, Typography } from '@mui/material';
import { TabPanel } from '../../../simple-tabs/tab-panel';
import { TabPanelProps } from '../../../simple-tabs/types';
import { EquipmentSlots } from '../../equipment/equipment-slots';
import { useCharacter } from '../../../../context/character-context/character-context';
import { useResponsive } from '../../../../hooks/use-responsive';

const StyledTabPanel = styled(TabPanel)`
    position: relative;
    column-gap: 0;
`;

const EmptyStateOverlay = styled(Box)`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(10px);
    z-index: 10;
    cursor: pointer;
`;

interface EquipmentTabProps extends TabPanelProps {}

export function EquipmentTab({ ...panelProps }: EquipmentTabProps) {
    const { isMobile } = useResponsive();
    const { character } = useCharacter();

    const [dismissedOverlay, setDismissedOverlay] = useState(false);

    const hasAnyEquippedItems = useMemo(() => {
        const items = character.getEquipment();

        return Object.keys(items).length > 0;
    }, [character]);

    return (
        <StyledTabPanel {...panelProps}>
            {!hasAnyEquippedItems && !dismissedOverlay && (
                <EmptyStateOverlay onClick={() => setDismissedOverlay(true)}>
                    <Typography variant="body1">
                        No equipment yet, {isMobile ? 'tap' : 'click'} here to
                        add some!
                    </Typography>
                </EmptyStateOverlay>
            )}
            <EquipmentSlots />
        </StyledTabPanel>
    );
}
