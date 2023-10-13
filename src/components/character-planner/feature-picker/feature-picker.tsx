import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import {
    ICharacterFeatureCustomizationOption,
    CharacterPlannerStep,
} from 'planner-types/src/types/character-feature-customization-option';
import { Paper } from '@mui/material';
import GrantedEffect from '../granted-effect';
import { Utils } from '../../../models/utils';
import { CharacterPlannerStepDescriptions } from './types';

interface FeaturePickerProps {
    choices: ICharacterFeatureCustomizationOption[];
    onEvent: (event: CharacterPlannerStep, value: any) => void;
    event: CharacterPlannerStep;
}

export default function FeaturePicker({
    choices,
    onEvent,
    event,
}: FeaturePickerProps) {
    const [selectedOption, setSelectedOption] =
        useState<ICharacterFeatureCustomizationOption | null>(null);

    useEffect(() => {
        setSelectedOption(null);
    }, [choices]);

    // Preload subchoice assets for the selected options
    useEffect(() => {
        if (selectedOption?.choices) {
            // Only need to preload first choice, others handled by decision queue preloader
            Utils.preloadChoiceImages(selectedOption.choices[0]);
        }
    }, [selectedOption]);

    const gridSize = {
        xs: 12,
        sm: choices.length < 4 ? 12 / choices.length : 6,
        md: choices.length < 4 ? 12 / choices.length : 4,
        lg: choices.length < 4 ? 12 / choices.length : 3,
    };

    const showDescription = typeof selectedOption?.description === 'string';
    const showEffects =
        (selectedOption?.grants && selectedOption.grants.length > 0) ||
        selectedOption?.choiceType;

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                flex: 1,
                width: '100%',
                alignItems: 'center',
                gap: '1rem',
            }}
        >
            <Grid container spacing={3}>
                {choices.map((option) => (
                    <Grid
                        item
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        {...gridSize}
                        key={option.name}
                        style={{ display: 'flex' }}
                    >
                        <Card
                            elevation={2}
                            style={{
                                maxWidth: '100%',
                                opacity: selectedOption === option ? 0.85 : 1,
                                border:
                                    selectedOption === option
                                        ? '3px solid #3f51b5'
                                        : '3px solid transparent',
                                flex: 1,
                            }}
                        >
                            <CardActionArea
                                onClick={() => setSelectedOption(option)}
                                style={{
                                    position: 'relative',
                                    minHeight: '160px',
                                }}
                            >
                                {option.image && (
                                    <CardMedia
                                        component="img"
                                        image={option.image}
                                        style={{
                                            height: '160px',
                                            objectFit: 'cover',
                                            objectPosition: 'center -20px',
                                            opacity: 0.33, // Fading the image a bit
                                        }}
                                    />
                                )}
                                <Typography
                                    variant="h6"
                                    component="div"
                                    style={{
                                        position: 'absolute',
                                        bottom: '8px',
                                        left: '8px',
                                        textShadow:
                                            '3px 3px 5px rgba(0, 0, 0, 0.7)',
                                    }}
                                >
                                    {option.name}
                                </Typography>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {(showDescription || showEffects) && (
                <Paper elevation={2} style={{ padding: '0.5rem' }}>
                    {showDescription && (
                        <Typography
                            variant="body2"
                            style={{
                                minHeight: '60px',
                                margin: '20px 0 10px',
                                textAlign: 'center',
                            }}
                        >
                            {selectedOption?.description}
                        </Typography>
                    )}

                    {/* Display grantable effects for the selected feature */}
                    {showEffects && (
                        <div style={{ margin: '10px 0', textAlign: 'center' }}>
                            <Typography
                                variant="body2"
                                style={{ margin: '0 0 5px' }}
                            >
                                You will gain:
                            </Typography>
                            {selectedOption?.grants &&
                                selectedOption.grants
                                    .filter((fx) => !fx.hidden)
                                    .map((fx) => (
                                        <GrantedEffect
                                            effect={fx}
                                            elevation={4}
                                        />
                                    ))}
                            {selectedOption.choiceType && (
                                <Typography
                                    variant="body2"
                                    style={{ fontWeight: 600 }}
                                >
                                    {CharacterPlannerStepDescriptions.get(
                                        selectedOption.choiceType,
                                    )}
                                </Typography>
                            )}
                        </div>
                    )}
                </Paper>
            )}

            <div style={{ textAlign: 'center', margin: '10px 0 0' }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => onEvent(event, selectedOption)}
                    style={{
                        visibility: selectedOption ? 'visible' : 'hidden',
                    }}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
