// character.ts
import {
    ICharacterFeatureCustomizationOption,
    CharacterPlannerStep,
} from 'planner-types/src/types/character-feature-customization-option';
import {
    Characteristic,
    GrantableEffect,
    GrantableEffectSubtype,
    GrantableEffectType,
    Proficiency,
} from 'planner-types/src/types/grantable-effect';
import { AbilityScores, CharacterClassOption, ICharacter } from './types';
import { PendingDecision } from './pending-decision/pending-decision';
import {
    CharacterTreeDecision,
    CharacterTreeEffect,
    CharacterTreeRoot,
} from './character-tree-node/character-tree';
import {
    CharacterTreeNodeType,
    ICharacterTreeDecision,
    ICharacterTreeNode,
} from './character-tree-node/types';
import { IPendingDecision } from './character-states';

export class Character implements ICharacter {
    static MAX_LEVEL = 12;
    static LEVEL_STEPS = [
        CharacterPlannerStep.LEVEL_UP,
        CharacterPlannerStep.MULTICLASS,
        CharacterPlannerStep.SET_CLASS,
    ];
    static LEVEL_ROOTS = [
        CharacterPlannerStep.MULTICLASS,
        CharacterPlannerStep.SET_CLASS,
    ];

    root: CharacterTreeRoot = new CharacterTreeRoot();

    pendingDecisions: PendingDecision[] = [];

    constructor(public classData: CharacterClassOption[]) {
        this.updateClassDataEffects();

        const initialDecisions: PendingDecision[] = [
            CharacterPlannerStep.SET_RACE,
            CharacterPlannerStep.SET_CLASS,
            CharacterPlannerStep.SET_BACKGROUND,
            CharacterPlannerStep.SET_ABILITY_SCORES,
        ].map((type) => {
            const parent = new CharacterTreeDecision({
                name: type,
                choiceType: type,
            });

            this.root.addChild(parent);

            return new PendingDecision(type, parent);
        });

        this.pendingDecisions.push(...initialDecisions);
    }

    multiclassOption: ICharacterFeatureCustomizationOption = {
        name: 'Add a class',
        description: 'Add a level in a new class.',
        choiceType: CharacterPlannerStep.MULTICLASS,
    };

    name: string = 'Tav';

    // State management =======================================================

    getNextDecision(): PendingDecision | null {
        return this.pendingDecisions[0] || null;
    }

    unqueueDecision(decision: PendingDecision) {
        const index = this.pendingDecisions.findIndex(
            (dec) => dec === decision,
        );

        if (index > -1) {
            this.pendingDecisions.splice(index, 1);
        } else {
            throw new Error(
                'Attempted to complete a pending decision that was not in the queue.',
            );
        }
    }

    makeDecision(
        pending: IPendingDecision,
        choice: ICharacterFeatureCustomizationOption,
    ): Character {
        const { type } = pending;
        let { parent } = pending;
        this.unqueueDecision(pending as PendingDecision);

        if (!parent && Character.LEVEL_STEPS.includes(type)) {
            parent = this.findClassParent(choice);
        }

        if (!parent) {
            throw new Error('Could not find parent when making decision');
        }

        if (this.root.findNode((node) => node === parent) === null) {
            throw new Error('Parent exists, but is not found in tree');
        }

        const isProxyChoice =
            choice.choiceType === CharacterPlannerStep.MULTICLASS &&
            parent !== this.root;

        if (isProxyChoice) {
            // impose the choices onto the proxied parent
            const targetParent = this.findDecisionByChoiceType(
                choice.choiceType as CharacterPlannerStep,
            )!;
            // FIXME: mutation here MIGHT be dangerous, but we have to keep the same object pointer or the parent won't be found
            targetParent.choices = choice.choices;
            this.queueSubchoices(targetParent);
        } else {
            const decision = new CharacterTreeDecision({ type, ...choice });
            parent.addChild(decision);
            Character.grantEffects(decision);

            if (type === CharacterPlannerStep.CHOOSE_SUBCLASS) {
                this.collapseSubclassFeatures(decision.name);
                this.updateClassDataEffects();
            }

            if (Character.LEVEL_STEPS.includes(type)) {
                this.updateClassDataEffects();
            }

            this.queueSubchoices(decision);
        }

        return this.clone();
    }

    clone(): Character {
        return Object.assign(new Character(this.classData), this);
    }

    private queueSubchoices(parent: CharacterTreeDecision) {
        if (!parent.choiceType || !parent.choices) {
            return;
        }

        this.pendingDecisions.unshift(
            new PendingDecision(parent.choiceType, parent, parent.choices),
        );
    }

    private collapseSubclassFeatures(subclassName: string): void {
        this.classData = this.classData.map((cls) => {
            return {
                ...cls,
                progression: cls.progression.map((level) => ({
                    ...level,
                    Features: level.Features.map((feature) => {
                        if (
                            feature?.choiceType !==
                            CharacterPlannerStep.SUBCLASS_FEATURE
                        ) {
                            return feature;
                        }

                        // Make sure the subclass we're collapsing exists in these choices
                        if (
                            !feature?.choices?.[0] ||
                            feature.choices[0].findIndex(
                                (choice) => choice.name === subclassName,
                            ) < 0
                        ) {
                            return feature;
                        }

                        return {
                            ...feature,
                            choices: undefined,
                            choiceType: undefined,
                            grants: (
                                feature
                                    ?.choices?.[0] as ICharacterFeatureCustomizationOption[]
                            ).find(
                                (subclass) => subclass.name === subclassName,
                            )!.grants,
                        };
                    }),
                })),
            };
        });
    }

    private updateClassDataEffects(): void {
        const levelInfo = this.getClasses();

        this.classData = this.classData.map((cls) => {
            const level =
                levelInfo.find((info) => info.class.name === cls.name)
                    ?.levels ?? 0;

            const choices = cls.progression[level].Features.flatMap(
                (feature) => feature.choices,
            ).filter(Boolean) as ICharacterFeatureCustomizationOption[][];

            return {
                ...cls,
                choices,
                choiceType:
                    choices.length > 0
                        ? CharacterPlannerStep.CHOOSE_SUBCLASS
                        : undefined,
                grants: cls.progression[level].Features.flatMap(
                    (feature) => feature.grants,
                ).filter(Boolean) as unknown as GrantableEffect[],
            };
        });
    }

    levelUp(): Character {
        if (!this.canLevel()) {
            return this;
        }

        const currentClassNames = (
            this.findAllDecisionsByChoiceType(Character.LEVEL_ROOTS)
                .flatMap((node) => node.children)
                .filter(Boolean) as ICharacterTreeDecision[]
        ).map((decision) => decision.name);

        const currentClasses = this.classData.filter((cls) =>
            currentClassNames.includes(cls.name),
        );

        const newClasses = this.classData.filter(
            (cls) => !currentClasses.includes(cls),
        );

        const decision: PendingDecision = new PendingDecision(
            CharacterPlannerStep.LEVEL_UP,
            null,
            [
                [
                    ...currentClasses,
                    {
                        ...this.multiclassOption,
                        choices: [newClasses],
                    },
                ],
            ],
        );

        this.pendingDecisions.unshift(decision);

        return this.clone();
    }

    findClassParent(
        choice: ICharacterFeatureCustomizationOption,
    ): CharacterTreeDecision | CharacterTreeRoot {
        return (
            (this.root.findNode((node) => {
                if (node.nodeType !== CharacterTreeNodeType.DECISION) {
                    return false;
                }

                const decision: CharacterTreeDecision =
                    node as CharacterTreeDecision;

                return (
                    decision.name === choice.name &&
                    (typeof decision.children === 'undefined' ||
                        decision.children.every(
                            (child) => child.name !== choice.name,
                        ))
                );
            }) as CharacterTreeDecision | CharacterTreeRoot | null) ?? this.root
        );
    }

    static grantEffects(
        node: CharacterTreeDecision | CharacterTreeEffect,
    ): void {
        if (!node.grants) {
            return;
        }

        node.grants.forEach((effect) => {
            const child = new CharacterTreeEffect(effect);
            node.addChild(child);
            Character.grantEffects(child);
        });
    }

    // "Getters" for front end ================================================

    // eslint-disable-next-line class-methods-use-this
    canLevel(): boolean {
        return this.getTotalLevel() < Character.MAX_LEVEL;
    }

    getClasses(): {
        levels: number;
        class: CharacterClassOption;
        subclass?: CharacterTreeDecision;
    }[] {
        // Create a map to count occurrences of each class
        const classCount = new Map<string, number>();

        const classes = this.findAllDecisionsByOptionType(
            Character.LEVEL_STEPS,
        ).filter(
            (node) => node?.choiceType !== CharacterPlannerStep.MULTICLASS,
        ) as ICharacterTreeDecision[];

        classes.forEach((cls) => {
            classCount.set(cls.name, (classCount.get(cls.name) || 0) + 1);
        });

        // Convert the map to an array of objects
        const classesArray = Array.from(classCount).map(
            ([className, count]) => {
                // find the subclass, if it exists
                // FIXME: doesnt work for the same reason as above
                const subclass = classes
                    .filter((cls) => cls.name === className)
                    .map(
                        (cls) =>
                            cls.children?.find((node) => {
                                if (
                                    node.nodeType !==
                                    CharacterTreeNodeType.DECISION
                                ) {
                                    return false;
                                }

                                const decision = node as CharacterTreeDecision;

                                return (
                                    decision.choiceType ===
                                    CharacterPlannerStep.CHOOSE_SUBCLASS
                                );
                            }),
                    )
                    .find(Boolean) as CharacterTreeDecision | undefined; // filter out undefineds

                return {
                    class: this.classData.find(
                        (cls) => cls.name === className,
                    )!,
                    subclass,
                    levels: count,
                };
            },
        );

        // Sort the array
        classesArray.sort((a, b) => {
            // If one of the classes is the first class in levels, prioritize it
            // if (this.levels[0].name === a.class.name) return -1;
            // if (this.levels[0].name === b.class.name) return 1;
            // FIXME: No concept of first level yet

            // For all other classes, sort by the number of levels in descending order
            return b.levels - a.levels;
        });

        return classesArray;
    }

    getTotalLevel(): number {
        return this.getClasses().reduce((acc, { levels }) => acc + levels, 0);
    }

    getTotalAbilityScores(): AbilityScores | null {
        const abilityFx = this.getCharacteristics().filter(
            (effect) =>
                effect.subtype &&
                [
                    GrantableEffectSubtype.ABILITY_BASE,
                    GrantableEffectSubtype.ABILITY_RACIAL,
                ].includes(effect.subtype),
        );

        if (abilityFx.length === 0) {
            return null;
        }

        return Object.fromEntries(
            Object.keys(abilityFx[0].values).map((ability) => [
                ability,
                abilityFx.reduce(
                    (acc, effect) => acc + effect.values[ability],
                    0,
                ),
            ]),
        ) as unknown as AbilityScores;
    }

    getGrantedEffects(): GrantableEffect[] {
        const fx: CharacterTreeEffect[] = this.root.findAllNodes((node) => {
            if (node.nodeType !== CharacterTreeNodeType.EFFECT) {
                return false;
            }

            return true;
        }) as CharacterTreeEffect[];

        return fx;
    }

    getProficiencies(): Proficiency[] {
        // TODO: remove duplicates in a graceful way
        return this.getGrantedEffects().filter(
            (effect) => effect.type === GrantableEffectType.PROFICIENCY,
        ) as Proficiency[];
    }

    getActions(): GrantableEffect[] {
        return this.getGrantedEffects().filter(
            (effect) => effect.type === GrantableEffectType.ACTION,
        );
    }

    getCharacteristics(): Characteristic[] {
        return this.getGrantedEffects().filter(
            (effect) => effect.type === GrantableEffectType.CHARACTERISTIC,
        ) as Characteristic[];
    }

    private static findNodeByChoiceType(
        choiceType: CharacterPlannerStep | CharacterPlannerStep[],
    ): (node: ICharacterTreeNode) => boolean {
        return (node: ICharacterTreeNode) => {
            if (node.nodeType !== CharacterTreeNodeType.DECISION) {
                return false;
            }

            const decision = node as CharacterTreeDecision;

            return (
                typeof decision.choiceType !== 'undefined' &&
                (typeof choiceType === 'string'
                    ? decision.choiceType === choiceType
                    : choiceType.includes(decision.choiceType))
            );
        };
    }

    private findDecisionByChoiceType(
        choiceType: CharacterPlannerStep | CharacterPlannerStep[],
    ): CharacterTreeDecision | null {
        return this.root.findNode(
            Character.findNodeByChoiceType(choiceType),
        ) as CharacterTreeDecision | null;
    }

    private findAllDecisionsByChoiceType(
        choiceType: CharacterPlannerStep | CharacterPlannerStep[],
    ): CharacterTreeDecision[] {
        return this.root.findAllNodes(
            Character.findNodeByChoiceType(choiceType),
        ) as CharacterTreeDecision[];
    }

    private static findNodeByOptionType(
        type: CharacterPlannerStep | CharacterPlannerStep[],
    ): (node: ICharacterTreeNode) => boolean {
        return (node: ICharacterTreeNode) => {
            if (node.nodeType !== CharacterTreeNodeType.DECISION) {
                return false;
            }

            const decision = node as CharacterTreeDecision;

            return (
                typeof decision.type !== 'undefined' &&
                (typeof type === 'string'
                    ? decision.type === type
                    : type.includes(decision.type))
            );
        };
    }

    private findDecisionByOptionType(
        type: CharacterPlannerStep | CharacterPlannerStep[],
    ): CharacterTreeDecision | null {
        return this.root.findNode(
            Character.findNodeByOptionType(type),
        ) as CharacterTreeDecision | null;
    }

    private findAllDecisionsByOptionType(
        type: CharacterPlannerStep | CharacterPlannerStep[],
    ): CharacterTreeDecision[] {
        return this.root.findAllNodes(
            Character.findNodeByOptionType(type),
        ) as CharacterTreeDecision[];
    }

    getRace(): ICharacterTreeDecision | undefined {
        return this.findDecisionByChoiceType(CharacterPlannerStep.SET_RACE)
            ?.children?.[0] as ICharacterTreeDecision | undefined;
    }

    getSubrace(): ICharacterTreeDecision | undefined {
        return this.findDecisionByChoiceType(
            CharacterPlannerStep.CHOOSE_SUBRACE,
        )?.children?.[0] as ICharacterTreeDecision | undefined;
    }

    getBackground(): ICharacterTreeDecision | undefined {
        return this.findDecisionByChoiceType(
            CharacterPlannerStep.SET_BACKGROUND,
        )?.children?.[0] as ICharacterTreeDecision | undefined;
    }
}
