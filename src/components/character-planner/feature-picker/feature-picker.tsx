import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { CharacterEvents } from '../../../models/character/types';
import { ICharacterFeatureCustomizationOption } from '../choice-picker/types';

interface FeaturePickerProps {
    choices: ICharacterFeatureCustomizationOption[];
    onEvent: (event: CharacterEvents, value: any) => void;
    event: CharacterEvents;
}

export default function FeaturePicker({
    choices,
    onEvent,
    event,
}: FeaturePickerProps) {
    // State to track the current selection
    const [selectedOption, setSelectedOption] =
        useState<ICharacterFeatureCustomizationOption | null>(null);

    return (
        <div>
            <Grid container spacing={3}>
                {choices.map((option) => (
                    <Grid item xs={6} sm={4} md={3} key={option.name}>
                        <Card
                            style={{
                                opacity: selectedOption === option ? 0.85 : 1,
                                border:
                                    selectedOption === option
                                        ? '3px solid #3f51b5'
                                        : '3px solid transparent',
                                boxShadow:
                                    selectedOption === option
                                        ? '0px 4px 20px rgba(0, 0, 0, 0.2)'
                                        : 'none',
                            }}
                        >
                            <CardActionArea
                                onClick={() => setSelectedOption(option)}
                            >
                                <CardMedia
                                    component="img"
                                    alt={option.name}
                                    height="140"
                                    image={option.image}
                                    title={option.name}
                                />
                                <CardContent>
                                    <Typography
                                        gutterBottom
                                        variant="h6"
                                        component="div"
                                    >
                                        {option.name}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Description of the selected choice */}
            <Typography
                variant="body2"
                style={{
                    minHeight: '60px',
                    margin: '20px 0',
                    textAlign: 'center',
                }}
            >
                {selectedOption?.description}
            </Typography>

            {/* Button to submit the selected choice */}
            {selectedOption && (
                <div style={{ textAlign: 'center' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => onEvent(event, selectedOption)}
                    >
                        Confirm {selectedOption.name}
                    </Button>
                </div>
            )}
        </div>
    );
}
