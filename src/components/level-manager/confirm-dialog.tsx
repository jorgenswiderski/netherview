import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from '@mui/material';
import React, { ReactNode } from 'react';

interface ConfirmDialogProps {
    title: string;
    open: boolean;
    onCancel: () => void;
    onConfirm: () => void;
    children: ReactNode;
}

export function ConfirmDialog({
    title,
    children,
    onCancel,
    onConfirm,
    ...props
}: ConfirmDialogProps) {
    return (
        <Dialog {...props} onClose={onCancel}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>{children}</DialogContent>
            <DialogActions>
                <Button onClick={onCancel} color="primary" autoFocus>
                    Cancel
                </Button>
                <Button onClick={onConfirm} color="primary">
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
}
