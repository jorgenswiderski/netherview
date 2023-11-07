import React from 'react';
import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
} from '@mui/material';
import { AbilityScores } from '../../../models/character/types';

interface AbilityScoresProps {
    abilityScores: AbilityScores;
}

export function AbilityScoresTable({ abilityScores }: AbilityScoresProps) {
    const keys: (keyof AbilityScores)[] = Object.keys(
        abilityScores,
    ) as (keyof AbilityScores)[];

    return (
        <Paper elevation={2} style={{ padding: '12px' }}>
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
        </Paper>
    );
}
