// character.ts

import {
    ICharacterFeatureCustomizationOption,
    CharacterPlannerStep,
} from 'planner-types/src/types/character-feature-customization-option';
import {
    Characteristic,
    GrantableEffect,
    GrantableEffectType,
    Proficiency,
} from 'planner-types/src/types/grantable-effect';
import { ICharacterDecision } from './character-states';
import {
    AbilityScores,
    CharacterClassOption,
    CharacterClassOptionWithSource,
    GrantableEffectWithSource,
    ICharacter,
    ICharacterFeatureCustomizationOptionWithSource,
} from './types';
import { CharacterDecision } from './character-decision';

export class Character implements ICharacter {
    static MAX_LEVEL = 12;

    constructor(public classData: CharacterClassOption[]) {}

    decisions: ICharacterFeatureCustomizationOption[] = [{ name: 'ROOT' }];

    multiclassOption: ICharacterFeatureCustomizationOptionWithSource = {
        name: 'Add a class',
        description: 'Add a level in a new class.',
        choiceType: CharacterPlannerStep.MULTICLASS,
        source: this.decisions[0],
    };

    decisionQueue: ICharacterDecision[] = [
        CharacterPlannerStep.SET_RACE,
        CharacterPlannerStep.SET_CLASS,
        CharacterPlannerStep.SET_BACKGROUND,
        CharacterPlannerStep.SET_ABILITY_SCORES,
    ].map((cd) => ({
        type: cd,
        source: this.decisions[0],
    }));

    name: string = 'Tav';

    nextDecision(): ICharacterDecision | null {
        return this.decisionQueue[0] || null;
    }

    completeDecision(decision: CharacterPlannerStep) {
        const index = this.decisionQueue.findIndex(
            (value) => value.type === decision,
        );

        if (index > -1) {
            this.decisionQueue.splice(index, 1);
        }
    }

    addFeature(
        event: CharacterPlannerStep,
        feature: ICharacterFeatureCustomizationOptionWithSource,
    ): void {
        if (
            event === CharacterPlannerStep.SET_CLASS ||
            event === CharacterPlannerStep.LEVEL_UP ||
            event === CharacterPlannerStep.MULTICLASS
        ) {
            if (feature.choiceType !== CharacterPlannerStep.MULTICLASS) {
                this.addClass(feature as unknown as CharacterClassOption);
            }
        } else if (event === CharacterPlannerStep.SET_RACE) {
            this.setRace(feature);
        } else if (event === CharacterPlannerStep.CHOOSE_SUBRACE) {
            this.setSubrace(feature);
        } else if (event === CharacterPlannerStep.SET_BACKGROUND) {
            this.setBackground(feature);
        } else if (event === CharacterPlannerStep.CHOOSE_SUBCLASS) {
            this.setSubclass(feature);
        } else {
            throw new Error('Invalid character event');
        }

        this.grantEffects(feature);
        this.queueSubchoices(feature);
    }

    onEvent(event: CharacterPlannerStep, value: any): Character {
        this.completeDecision(event);

        if (event === CharacterPlannerStep.SET_ABILITY_SCORES) {
            this.setAbilityScores(value);
        } else {
            this.addFeature(event, value);
        }

        return this.clone();
    }

    clone(): Character {
        return Object.assign(new Character(this.classData), this);
    }

    private queueSubchoices(feature: ICharacterFeatureCustomizationOption) {
        if (!feature.choiceType || !feature.choices) {
            return;
        }

        this.decisionQueue.unshift(new CharacterDecision(feature));
    }

    levels: CharacterClassOption[] = [];

    addClass(cls: CharacterClassOption): void {
        if (this.levels.length >= Character.MAX_LEVEL) {
            throw new Error('Cannot exceed level 12');
        }

        this.levels.push(cls);
    }

    race?: ICharacterFeatureCustomizationOption;

    setRace(race: ICharacterFeatureCustomizationOption): void {
        this.race = race;
    }

    subrace?: ICharacterFeatureCustomizationOption;

    setSubrace(subrace: ICharacterFeatureCustomizationOption): void {
        this.subrace = subrace;
    }

    baseAbilityScores?: AbilityScores;
    racialAbilityBonuses?: (keyof AbilityScores)[];

    setAbilityScores(values: {
        abilityScores: AbilityScores;
        bonusTwo: keyof AbilityScores;
        bonusOne: keyof AbilityScores;
    }): void {
        this.baseAbilityScores = values.abilityScores;
        this.racialAbilityBonuses = [values.bonusTwo, values.bonusOne];
    }

    background?: ICharacterFeatureCustomizationOption;

    setBackground(background: ICharacterFeatureCustomizationOption): void {
        this.background = background;
    }

    // FIXME: Character can have multiple
    subclasses: ICharacterFeatureCustomizationOptionWithSource[] = [];

    setSubclass(subclass: ICharacterFeatureCustomizationOptionWithSource) {
        this.subclasses.push(subclass);
    }

    canLevel(): boolean {
        return this.levels.length < Character.MAX_LEVEL;
    }

    levelUp(): Character {
        if (!this.canLevel()) {
            return this;
        }

        const classesWithEffects = this.augmentClassOptions(this.classData);
        const currentClasses = classesWithEffects.filter(
            (cls) =>
                this.levels.findIndex((level) => level.name === cls.name) > -1,
        );
        const newClasses = classesWithEffects.filter(
            (cls) =>
                this.levels.findIndex((level) => level.name === cls.name) < 0,
        );

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const a: ICharacterFeatureCustomizationOptionWithSource = newClasses[0];

        const decision: ICharacterDecision = {
            type: CharacterPlannerStep.LEVEL_UP,
            choices: [
                [
                    ...currentClasses,
                    {
                        ...this.multiclassOption,
                        choices: [newClasses],
                    },
                ],
            ],
        };

        this.decisionQueue.unshift(decision);

        return this.clone();
    }

    // ========================================================================

    getClasses(): {
        levels: number;
        class: CharacterClassOption;
        subclass?: ICharacterFeatureCustomizationOptionWithSource;
    }[] {
        // Create a map to count occurrences of each class
        const classCount = new Map<string, number>();

        this.levels.forEach((cls) => {
            classCount.set(cls.name, (classCount.get(cls.name) || 0) + 1);
        });

        // Convert the map to an array of objects
        const classesArray = Array.from(classCount).map(
            ([className, count]) => {
                // find the subclass name, if it exists
                const subclass = this.subclasses.find(
                    (sc) => sc.source.name === className,
                );

                return {
                    class: this.classData.find(
                        (cls) => cls.name === className,
                    ) as CharacterClassOption,
                    subclass,
                    levels: count,
                };
            },
        );

        // Sort the array
        classesArray.sort((a, b) => {
            // If one of the classes is the first class in levels, prioritize it
            if (this.levels[0].name === a.class.name) return -1;
            if (this.levels[0].name === b.class.name) return 1;

            // For all other classes, sort by the number of levels in descending order
            return b.levels - a.levels;
        });

        return classesArray;
    }

    getTotalAbilityScores(): AbilityScores {
        if (!this.baseAbilityScores) {
            throw new Error(
                'Base ability scores are not set for the character.',
            );
        }

        // Start with a clone of the base ability scores
        const totalAbilityScores = { ...this.baseAbilityScores };

        // Apply racial ability bonuses if they exist
        if (this.racialAbilityBonuses) {
            if (this.racialAbilityBonuses[0]) {
                totalAbilityScores[this.racialAbilityBonuses[0]] += 2;
            }

            if (this.racialAbilityBonuses[1]) {
                totalAbilityScores[this.racialAbilityBonuses[1]] += 1;
            }
        }

        return totalAbilityScores;
    }

    grantedEffects: GrantableEffectWithSource[] = [];

    grantEffects(feature: ICharacterFeatureCustomizationOption): void {
        if (!feature.grants) {
            return;
        }

        feature.grants.forEach((fx) => {
            const sourced = { ...fx, source: feature };
            this.grantedEffects.push(sourced);
        });
    }

    getProficiencies(): Proficiency[] {
        const allProficiencies = this.grantedEffects.filter(
            (fx) => !fx.hidden && fx.type === GrantableEffectType.PROFICIENCY,
        ) as unknown as Proficiency[];

        // TODO: remove duplicates in a graceful way
        return allProficiencies;
    }

    getActions(): GrantableEffectWithSource[] {
        return this.grantedEffects.filter(
            (fx) => !fx.hidden && fx.type === GrantableEffectType.ACTION,
        );
    }

    getCharacteristics(): Characteristic[] {
        return this.grantedEffects.filter(
            (fx) =>
                !fx.hidden && fx.type === GrantableEffectType.CHARACTERISTIC,
        ) as unknown as Characteristic[];
    }

    augmentClassOptions(
        classes: CharacterClassOption[],
    ): CharacterClassOptionWithSource[] {
        return classes.map((cls): CharacterClassOptionWithSource => {
            // Count the number of levels in this class
            const levelCount = this.levels.filter(
                (level) => level.name === cls.name,
            ).length;

            const clsData = this.classData.find(
                (data) => data.name === cls.name,
            );

            if (!clsData) {
                throw new Error('could not find class');
            }

            const { progression } = clsData;
            const levelFeatures = progression[levelCount].Features;

            // find the highest level of this class and add it as the source
            const source = this.levels.findLast(
                (level) => level.name === cls.name,
            );

            const choices = levelFeatures
                .flatMap((feature) => feature.choices)
                .filter(Boolean) as ICharacterFeatureCustomizationOption[][];

            return {
                ...cls,
                grants: levelFeatures
                    .flatMap((feature) => feature.grants)
                    .filter(Boolean) as GrantableEffect[],
                choices,
                choiceType: levelFeatures.find((feature) => feature.choiceType)
                    ?.choiceType, // FIXME
                source: source ?? this.decisions[0],
            };
        });
    }

    augmentCustomizationOptionWithRoot(
        choices: ICharacterFeatureCustomizationOption[][],
    ): ICharacterFeatureCustomizationOptionWithSource[][] {
        return choices.map((choiceA) =>
            choiceA.map((choiceB) => ({
                ...choiceB,
                source: this.decisions[0],
            })),
        );
    }
}
