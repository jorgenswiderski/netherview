import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import React, { ReactNode } from 'react';

interface ConfirmDialogProps {
    title: string;
    open: boolean;
    onCancel: () => void;
    onConfirm: () => void;
    children: ReactNode;
}

export default function ConfirmDialog({
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
