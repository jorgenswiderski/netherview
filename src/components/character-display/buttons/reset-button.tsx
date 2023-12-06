import React, { useState, useCallback } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { IconButton, Paper, Tooltip, Typography } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useCharacter } from '../../../context/character-context/character-context';

export function ResetButton() {
    const { character, resetCharacter } = useCharacter();

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleConfirm = useCallback(async () => {
        resetCharacter();
        setIsDialogOpen(false);
    }, [character, resetCharacter]);

    return (
        <>
            <Tooltip
                title="Reset character"
                PopperProps={{ style: { pointerEvents: 'none' } }}
            >
                {/* Wrap in span so tooltip doesn't get disabled */}
                <span>
                    <IconButton onClick={() => setIsDialogOpen(true)}>
                        <RestartAltIcon />
                    </IconButton>
                </span>
            </Tooltip>

            {isDialogOpen && (
                <Dialog
                    open={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    fullWidth
                >
                    <DialogTitle>Confirm Reset</DialogTitle>
                    <DialogContent sx={{ minWidth: 500, padding: 3 }}>
                        <Paper elevation={2} sx={{ padding: '1rem' }}>
                            <Typography>
                                Are you sure you want to start over?
                            </Typography>
                        </Paper>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setIsDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleConfirm}>Confirm</Button>
                    </DialogActions>
                </Dialog>
            )}
        </>
    );
}
