import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia, { CardMediaProps } from '@mui/material/CardMedia';
import Typography, { TypographyProps } from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import {
    CharacterPlannerStep,
    ICharacterFeatureCustomizationOption,
} from 'planner-types/src/types/character-feature-customization-option';
import { Paper } from '@mui/material';
import styled from '@emotion/styled';
import GrantedEffect from '../granted-effect';
import { Utils } from '../../../models/utils';
import { CharacterPlannerStepDescriptions } from './types';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
    width: 100%;
    align-items: center;
    gap: 1rem;
`;

const StyledGridContainer = styled(Grid)`
    & > .MuiGrid-item {
        padding: 12px; // This is half of the 24px (spacing={3}). You may adjust as needed

        @media (max-width: 600px) {
            padding: 6px; // Reduce to half (or whatever desired value) for mobile
        }
    }
`;

const StyledGrid = styled(Grid)`
    display: flex;
`;

const StyledCard = styled(Card)<{ selected: boolean }>`
    max-width: 100%;
    opacity: ${(props) => (props.selected ? 0.85 : 1)};
    border: 3px solid ${(props) => (props.selected ? '#3f51b5' : 'transparent')};
    flex: 1;
`;

const ActionArea = styled(CardActionArea)`
    position: relative;
    min-height: 160px;

    @media (max-width: 600px) {
        min-height: 120px; // Reduced height for mobile
    }
`;

const CardMediaStyle = styled(CardMedia)<CardMediaProps>`
    height: 160px;
    object-fit: cover;
    object-position: center -20px;
    opacity: 0.33;

    @media (max-width: 600px) {
        height: 120px; // Matching reduced height for mobile
    }
`;

const OptionName = styled(Typography)<TypographyProps>`
    position: absolute;
    bottom: 8px;
    left: 8px;
    text-shadow: 3px 3px 5px rgba(0, 0, 0, 0.7);

    @media (min-width: 600px) {
        font-size: 1rem;
    }
`;

const DescriptionText = styled(Typography)`
    min-height: 60px;
    margin: 10px 0;
    text-align: center;

    @media (min-width: 600px) {
        font-size: 1rem;
        margin: 20px 0 10px;
    }
`;

const DescriptionPaper = styled(Paper)`
    padding: 0.5rem;
`;

const EffectsContainer = styled.div`
    margin: 10px 0;
    text-align: center;
`;

const ButtonContainer = styled.div`
    text-align: center;
    margin: 10px 0 0;
    width: 100%;
`;

const NextButton = styled(Button)<{ visible: boolean }>`
    visibility: ${(props) => (props.visible ? 'visible' : 'hidden')};

    @media (max-width: 600px) {
        width: 100%;
    }
`;

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
        xs: choices.length < 4 ? 6 : 4,
        sm: choices.length < 4 ? 12 / choices.length : 6,
        md: choices.length < 4 ? 12 / choices.length : 4,
        lg: choices.length < 4 ? 12 / choices.length : 3,
    };

    const showDescription = typeof selectedOption?.description === 'string';
    const showEffects =
        (selectedOption?.grants && selectedOption.grants.length > 0) ||
        selectedOption?.choiceType;

    return (
        <Container>
            <StyledGridContainer container>
                {choices.map((option) => (
                    <StyledGrid item {...gridSize} key={option.name}>
                        <StyledCard
                            elevation={2}
                            selected={selectedOption === option}
                        >
                            <ActionArea
                                onClick={() => setSelectedOption(option)}
                            >
                                {option.image && (
                                    <CardMediaStyle
                                        component="img"
                                        image={option.image}
                                    />
                                )}
                                <OptionName variant="h6" component="div">
                                    {option.name}
                                </OptionName>
                            </ActionArea>
                        </StyledCard>
                    </StyledGrid>
                ))}
            </StyledGridContainer>

            {(showDescription || showEffects) && (
                <DescriptionPaper elevation={2}>
                    {showDescription && (
                        <DescriptionText variant="body2">
                            {selectedOption?.description}
                        </DescriptionText>
                    )}

                    {showEffects && (
                        <EffectsContainer>
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
                        </EffectsContainer>
                    )}
                </DescriptionPaper>
            )}

            <ButtonContainer>
                <NextButton
                    variant="contained"
                    color="primary"
                    onClick={() => onEvent(event, selectedOption)}
                    visible={!!selectedOption}
                >
                    Next
                </NextButton>
            </ButtonContainer>
        </Container>
    );
}
