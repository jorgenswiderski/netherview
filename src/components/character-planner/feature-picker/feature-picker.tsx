import React, { useEffect, useMemo, useRef, useState } from 'react';
import CardMedia, { CardMediaProps } from '@mui/material/CardMedia';
import Typography, { TypographyProps } from '@mui/material/Typography';
import { ICharacterOption } from '@jorgenswiderski/tomekeeper-shared/dist/types/character-feature-customization-option';
import { Box, Card, CardActionArea, Grid, Paper } from '@mui/material';
import styled from '@emotion/styled';
import { IActionEffect } from '@jorgenswiderski/tomekeeper-shared/dist/types/grantable-effect';
import { IPendingDecision } from '../../../models/character/character-states';
import { ProspectiveEffects } from './prospective-effects/prospective-effects';
import { WeaveImages } from '../../../api/weave/weave-images';
import { PlannerHeader } from '../planner-header/planner-header';
import { useFeaturePicker } from './use-feature-picker';
import { Preloader } from '../../../models/preloader';

enum LayoutType {
    SPARSE,
    DENSE,
}

const MainBox = styled(Box)`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    flex: 1;
    height: 100%;
    width: 100%;
    align-items: center;
    gap: 1rem;
    overflow: hidden;
`;

const StyledGridContainer = styled(Grid)`
    & > .MuiGrid-item {
        padding: 9px;

        @media (max-width: 600px) {
            padding: 6px; // Reduce to half for mobile
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

const ActionArea = styled(CardActionArea)<{ layout: LayoutType }>`
    position: relative;
    min-height: ${({ layout }) =>
        layout === LayoutType.DENSE ? '30px' : '160px'};

    @media (max-width: 600px) {
        min-height: ${({ layout }) =>
            layout === LayoutType.DENSE
                ? '30px'
                : '120px'}; // Reduced height for mobile
    }
`;

const CardMediaStyle = styled(CardMedia)`
    opacity: 0.33;

    @media (max-width: 600px) {
        height: 120px; // Matching reduced height for mobile
    }
`;

const CardMediaSparse = styled(CardMediaStyle)`
    height: 160px;
    object-fit: cover;
    object-position: center -20px;
`;

const CardMediaDense = styled(CardMediaStyle)`
    // height: 30px;
    width: 35%;
    position: absolute;
    right: 8px;
    top: -70%;
`;

interface NameLabelProps extends TypographyProps {
    layout: LayoutType;
}

const OptionName = styled(Typography)<NameLabelProps>`
    position: absolute;
    bottom: ${({ layout }) => (layout === LayoutType.DENSE ? '3px' : '8px')};
    left: 8px;
    text-shadow: 3px 3px 5px rgba(0, 0, 0, 0.7);

    @media (min-width: 600px) {
        font-size: 1rem;
    }
`;

const DescriptionText = styled(Typography)`
    text-align: center;
    padding: 0.5rem;
`;

const DescriptionPaper = styled(Paper)`
    padding: 0.5rem;
    width: 100%;
`;

interface FeaturePickerProps {
    title: string;
    decision: IPendingDecision;
    onDecision: (
        decision: IPendingDecision,
        choice: ICharacterOption[],
    ) => void;
    negate?: boolean;
}

type CardMediaPropsExtended = CardMediaProps & { layout: LayoutType };

export function FeaturePicker({
    title,
    decision,
    onDecision,
    negate,
}: FeaturePickerProps) {
    const { count } = decision;
    const { filteredOptions: options } = useFeaturePicker(decision);

    const [selectedOptions, setSelectedOptions] = useState<ICharacterOption[]>(
        [],
    );

    useEffect(() => {
        setSelectedOptions([]);
    }, [options]);

    // Preload subchoice assets for the selected options
    useEffect(() => {
        selectedOptions.forEach(
            (option) =>
                option.choices
                    ?.map((choice) => {
                        // Collapse choice if there's only one possible outcome
                        if ((choice.count ?? 1) >= choice.options.length) {
                            return choice.options[0].choices?.[0].options;
                        }

                        // Or if the option is forced
                        if (
                            choice.forcedOptions &&
                            choice.forcedOptions.length >= (choice.count ?? 1)
                        ) {
                            return choice.forcedOptions[0].choices?.[0].options;
                        }

                        return choice.options;
                    })
                    .filter(Boolean)
                    .forEach(Preloader.preloadOptionImages),
        );
    }, [selectedOptions]);

    const imageContainerRef = useRef<HTMLButtonElement>(null);

    const handleOptionClick = (option: ICharacterOption) => {
        if (selectedOptions.includes(option)) {
            setSelectedOptions((oldOptions) =>
                oldOptions.filter((s) => s !== option),
            );
        } else if (selectedOptions.length === count) {
            setSelectedOptions((oldOptions) => [
                ...oldOptions.slice(1, count),
                option,
            ]);
        } else {
            setSelectedOptions((oldOptions) => [...oldOptions, option]);
        }
    };

    const renderCardMedia = (props: CardMediaPropsExtended) => {
        const { layout, ...restProps } = props;

        switch (layout) {
            case LayoutType.SPARSE:
                return <CardMediaSparse {...restProps} />;
            case LayoutType.DENSE:
                return <CardMediaDense {...restProps} />;
            default:
                return null;
        }
    };

    const layoutType =
        options.length <= 12 ? LayoutType.SPARSE : LayoutType.DENSE;

    const gridSize =
        layoutType === LayoutType.DENSE
            ? { xs: 12, sm: 12, md: 12, lg: 6 }
            : {
                  xs: options.length < 4 ? 6 : 4,
                  sm: options.length < 4 ? 12 / options.length : 6,
                  md: options.length < 4 ? 12 / options.length : 4,
                  lg: options.length < 4 ? 12 / options.length : 3,
              };

    const showEffects =
        selectedOptions.flatMap((opt) => opt.grants ?? []).length > 0 ||
        selectedOptions.flatMap((opt) => opt.choices ?? []).length > 0;

    const selectedDescription = useMemo(() => {
        if (count > 1 || !selectedOptions[0]) {
            return undefined;
        }

        if (selectedOptions[0].description) {
            return selectedOptions[0].description;
        }

        if (
            (selectedOptions[0].choices ?? []).length === 0 &&
            selectedOptions[0].grants &&
            selectedOptions[0].grants.length === 1
        ) {
            return (
                selectedOptions[0].grants[0].description ??
                (selectedOptions[0].grants[0] as IActionEffect)?.action
                    ?.description
            );
        }

        return undefined;
    }, [selectedOptions]);

    const showDescription = typeof selectedDescription === 'string';

    const getOptionImage = (option: ICharacterOption) => {
        if (option.image) {
            return option.image;
        }

        if (
            (option?.choices ?? []).length === 0 &&
            option?.grants &&
            option.grants.length > 0
        ) {
            return (
                option.grants[0].image ??
                (option.grants[0] as IActionEffect)?.action?.image
            );
        }

        return undefined;
    };

    return (
        <MainBox>
            <PlannerHeader
                title={title}
                onButtonClick={() =>
                    selectedOptions && onDecision(decision, selectedOptions)
                }
                buttonDisabled={selectedOptions.length !== count}
            />

            <Box style={{ overflowY: 'auto', width: '100%' }}>
                <StyledGridContainer container>
                    {options.map((option) => (
                        <StyledGrid item {...gridSize} key={option.name}>
                            <StyledCard
                                elevation={2}
                                selected={selectedOptions.includes(option)}
                            >
                                <ActionArea
                                    onClick={() => handleOptionClick(option)}
                                    layout={layoutType}
                                    ref={imageContainerRef}
                                >
                                    {getOptionImage(option) &&
                                        renderCardMedia({
                                            component: 'img',
                                            image: WeaveImages.getPath(
                                                getOptionImage(option)!,
                                                276,
                                            ),
                                            layout: layoutType,
                                        })}
                                    <OptionName
                                        variant="h6"
                                        component="div"
                                        layout={layoutType}
                                    >
                                        {option.name}
                                    </OptionName>
                                </ActionArea>
                            </StyledCard>
                        </StyledGrid>
                    ))}
                </StyledGridContainer>
            </Box>

            {(showDescription || showEffects) && (
                <DescriptionPaper elevation={2}>
                    {showDescription && (
                        <DescriptionText variant="body2">
                            {selectedDescription}
                        </DescriptionText>
                    )}

                    {showEffects && (
                        <ProspectiveEffects
                            options={selectedOptions}
                            text={negate ? 'You will lose:' : 'You will gain:'}
                        />
                    )}
                </DescriptionPaper>
            )}
        </MainBox>
    );
}
