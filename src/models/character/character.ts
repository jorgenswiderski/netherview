// character.ts
import { ICharacterFeatureCustomizationOption } from '../../components/character-planner/feature-picker/types';
import { CharacterClassOption } from '../../components/character-planner/feature-picker/types-2';
import { CharacterDecision } from './character-states';
import { AbilityScores, CharacterEvents } from './types';

export class Character {
    static MAX_LEVEL = 12;

    static multiclassOption: ICharacterFeatureCustomizationOption = {
        name: 'Add a class',
        description: 'Add a level in a new class.',
        choiceType: CharacterEvents.MULTICLASS,
    };

    constructor(public classData: CharacterClassOption[]) {}

    decisionQueue: CharacterDecision[] = [
        CharacterEvents.SET_RACE,
        CharacterEvents.SET_CLASS,
        CharacterEvents.SET_BACKGROUND,
        CharacterEvents.SET_ABILITY_SCORES,
    ].map((cd) => ({
        type: cd,
    }));

    name: string = 'Tav';

    nextDecision(): CharacterDecision | null {
        return this.decisionQueue[0] || null;
    }

    completeDecision(decision: CharacterEvents) {
        const index = this.decisionQueue.findIndex(
            (value) => value.type === decision,
        );

        if (index > -1) {
            this.decisionQueue.splice(index, 1);
        }
    }

    addFeature(
        event: CharacterEvents,
        feature: ICharacterFeatureCustomizationOption,
    ): void {
        if (
            event === CharacterEvents.SET_CLASS ||
            event === CharacterEvents.LEVEL_UP ||
            event === CharacterEvents.MULTICLASS
        ) {
            if (feature.choiceType !== CharacterEvents.MULTICLASS) {
                this.addClass(feature as CharacterClassOption);
            }
        } else if (event === CharacterEvents.SET_RACE) {
            this.setRace(feature);
        } else if (event === CharacterEvents.SET_SUBRACE) {
            this.setSubrace(feature);
        } else if (event === CharacterEvents.SET_BACKGROUND) {
            this.setBackground(feature);
        } else if (event === CharacterEvents.CHOOSE_SUBCLASS) {
            this.setSubclass(feature);
        } else {
            throw new Error('Invalid character event');
        }

        this.queueSubchoices(feature);
    }

    onEvent(event: CharacterEvents, value: any): Character {
        this.completeDecision(event);

        if (event === CharacterEvents.SET_ABILITY_SCORES) {
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
        if (!feature.choiceType) {
            return;
        }

        this.decisionQueue.unshift({
            type: feature.choiceType,
            choices: feature.choices,
        });
    }

    levels: CharacterClassOption[] = [];

    addClass(cls: CharacterClassOption): void {
        if (this.levels.length >= Character.MAX_LEVEL) {
            throw new Error('Cannot exceed level 12');
        }

        this.levels.push(cls);

        // Count the number of levels in this class
        const levelCount = this.levels.filter(
            (level) => level.name === cls.name,
        ).length;

        const classData = this.classData.find((data) => data.name === cls.name);

        if (!classData) {
            return;
        }

        const { progression } = classData;
        const levelFeatures = progression[levelCount - 1].Features;

        if (!levelFeatures) {
            return;
        }

        const decisions = levelFeatures.filter(
            (feature) => feature.choices && feature.choiceType,
        );

        this.decisionQueue.unshift(
            ...decisions.map((decision) => ({
                type: decision.choiceType as CharacterEvents,
                choices: decision.choices,
            })),
        );
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
    subclass?: ICharacterFeatureCustomizationOption;

    setSubclass(subclass: ICharacterFeatureCustomizationOption) {
        this.subclass = subclass;
    }

    canLevel(): boolean {
        return this.levels.length < Character.MAX_LEVEL;
    }

    levelUp(): Character {
        if (!this.canLevel()) {
            return this;
        }

        const uniqueClasses = Object.values(
            Object.fromEntries(this.levels.map((level) => [level.name, level])),
        );

        this.decisionQueue.unshift({
            type: CharacterEvents.LEVEL_UP,
            choices: [
                [
                    ...uniqueClasses,
                    {
                        ...Character.multiclassOption,
                        choices: [
                            this.classData.filter(
                                (cls: CharacterClassOption) =>
                                    !this.levels.find(
                                        (
                                            level: ICharacterFeatureCustomizationOption,
                                        ) => level.name === cls.name,
                                    ),
                            ),
                        ],
                    },
                ],
            ],
        });

        return this.clone();
    }
}
