import { ICharacterOption } from '@jorgenswiderski/tomekeeper-shared/dist/types/character-feature-customization-option';
import { IActionEffect } from '@jorgenswiderski/tomekeeper-shared/dist/types/grantable-effect';
import { WeaveImages } from '../api/weave/weave-images';
import { characterDecisionInfo } from './character/character-states';
import { error } from './logger';

export class Preloader {
    static preloadOptionImages(options?: ICharacterOption[]): void {
        if (!Array.isArray(options)) {
            error(
                `Expected options to be an array but it was an ${typeof options}.`,
                options,
            );

            return;
        }

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

        // Preload the main images first
        const optionImages = options
            .map(getOptionImage)
            .filter(Boolean) as string[];

        optionImages.forEach((image) => {
            WeaveImages.preloadImage(image).catch(error);
        });

        function reducer(option: ICharacterOption): ICharacterOption[] {
            const allOptions = [option];

            if (option?.choices) {
                const flattened = option.choices
                    .filter(
                        (choice) =>
                            (choice.forcedOptions &&
                                choice.forcedOptions.length >=
                                    choice.options.length) ||
                            (choice.count ?? 1) >= choice.options.length,
                    )
                    .flatMap((choice) =>
                        (choice.count ?? 1) >= choice.options.length
                            ? choice.options
                            : choice.forcedOptions!,
                    )
                    .flatMap(reducer);

                allOptions.push(...flattened);
            }

            return allOptions;
        }

        const allOptions = options.flatMap(reducer);

        // Then the effect images
        const fxImages = allOptions
            .flatMap((option) => option.grants ?? [])
            .map((effect) => {
                return (
                    effect?.image ?? (effect as IActionEffect)?.action?.image
                );
            })
            .filter(Boolean) as string[]; // Filters out null or undefined values

        fxImages.forEach((image) => {
            WeaveImages.preloadImage(image).catch(error);
        });

        // And the choice images (used by ChoiceDescription)
        const choiceImages = allOptions
            .filter((option) => option.choices)
            .flatMap(
                (option) =>
                    option
                        .choices!.map(
                            (choice) =>
                                characterDecisionInfo[choice.type]?.image?.(
                                    option,
                                    choice,
                                ),
                        )
                        .filter(Boolean) as string[],
            );

        choiceImages.forEach((image) => {
            WeaveImages.preloadImage(image).catch(error);
        });

        // And the choice option images (used by the FeaturePicker CardMedia)
        const choiceOptionImages = options
            .filter((option) => option.choices)
            .flatMap((option) =>
                option.choices!.flatMap(
                    (choice) =>
                        choice.options
                            .map(getOptionImage)
                            .filter(Boolean) as string[],
                ),
            );

        choiceOptionImages.forEach((image) => {
            WeaveImages.preloadImage(image).catch(error);
        });
    }
}
