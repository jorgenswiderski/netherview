import React, { ReactNode } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { Card, CardContent, Link, Typography } from '@mui/material';
import { CONFIG } from '../models/config';

const content: { title: string; body: ReactNode[] }[] = [
    {
        title: `Welcome to ${CONFIG.APP_NAME} Beta!`,
        body: [
            `${CONFIG.APP_NAME} is a character planner for Baldur's
    Gate III. Plan and explore new builds, and share
    them with your friends!`,
        ],
    },
    {
        title: 'Beta Disclaimer',
        body: [
            "As this is a beta, you may notice a few rough edges. I'm working hard to improve Tomekeeper as fast as possible, but your patience is appreciated!",
            <>
                <Typography>
                    If there are any bugs or missing features that prevent it
                    from being useful to you, I&apos;d especially like to hear
                    about it in the discord:
                </Typography>
                <Link href={CONFIG.DISCORD_LINK} target="_blank">
                    {CONFIG.DISCORD_LINK}
                </Link>
            </>,
            "While I'd like to make sure that shared builds will be valid forever, I can't guarantee during this during the beta. Please plan accordingly!",
        ],
    },
    {
        title: 'Spoiler Warning',
        body: [
            'This app may contain equipment spoilers! I plan to make the app more spoiler friendly at a later date.',
        ],
    },
];

interface WelcomeDialogProps {
    onComplete: () => void;
}

export function WelcomeDialog({ onComplete }: WelcomeDialogProps) {
    const onWelcomeComplete = () => {
        localStorage.setItem('welcomed', 'true');
        onComplete();
    };

    return (
        <Dialog open onClose={onWelcomeComplete}>
            <DialogContent>
                {content.map(({ title, body }) => (
                    <Card key={title} variant="outlined" sx={{ mb: 2 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                {title}
                            </Typography>
                            {body.map((text) => (
                                <Typography variant="body1" paragraph>
                                    {text}
                                </Typography>
                            ))}
                        </CardContent>
                    </Card>
                ))}
            </DialogContent>
            <DialogActions>
                <Button onClick={onWelcomeComplete} color="primary">
                    Got it!
                </Button>
            </DialogActions>
        </Dialog>
    );
}
