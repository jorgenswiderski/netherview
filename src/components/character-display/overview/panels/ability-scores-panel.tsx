import React, { useMemo } from 'react';
import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
} from '@mui/material';
import styled from '@emotion/styled';
import { AbilityScores } from '../../../../models/character/types';
import { useCharacter } from '../../../../context/character-context/character-context';
import { TabPanelItem } from '../../../simple-tabs/tab-panel-item';

const StyledTabPanelItem = styled(TabPanelItem)`
    padding: 0.75rem;
`;

export function AbilityScoresPanel() {
    const { character } = useCharacter();

    const abilityScores = useMemo(
        () => character.getTotalAbilityScores(),
        [character],
    );

    if (!abilityScores) {
        return null;
    }

    const keys: (keyof AbilityScores)[] = Object.keys(
        abilityScores,
    ) as (keyof AbilityScores)[];

    return (
        <StyledTabPanelItem component={Paper} componentProps={{ elevation: 2 }}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        {keys.map((key, index) => (
                            <TableCell
                                key={key}
                                align="center"
                                style={{
                                    padding: '0 6px',
                                    fontWeight: '600',
                                    borderBottom: 'none',
                                    // Add vertical separator except for the last column
                                    borderRight:
                                        index !== keys.length - 1
                                            ? '1px solid rgba(0,0,0,0.4)'
                                            : 'none',
                                }}
                            >
                                {key.substring(0, 3).toUpperCase()}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        {keys.map((key, index) => (
                            <TableCell
                                key={key}
                                align="center"
                                style={{
                                    padding: '6px 6px',
                                    borderBottom: 'none',
                                    // Add vertical separator except for the last column
                                    borderRight:
                                        index !== keys.length - 1
                                            ? '1px solid rgba(0,0,0,0.4)'
                                            : 'none',
                                }}
                            >
                                {abilityScores[key]}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableBody>
            </Table>
        </StyledTabPanelItem>
    );
}
