// character.ts
import {
    ICharacterOption,
    CharacterPlannerStep,
    ICharacterChoice,
} from 'planner-types/src/types/character-feature-customization-option';
import {
    Characteristic,
    GrantableEffect,
    CharacteristicType,
    GrantableEffectType,
    Proficiency,
    ActionEffectType,
    ActionEffect,
} from 'planner-types/src/types/grantable-effect';
import { ISpell } from 'planner-types/src/types/spells';
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
import { CharacterDecisionInfo, IPendingDecision } from './character-states';
import { CharacterClassProgressionLevel } from '../../api/weave/types';

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

    pendingSteps: CharacterPlannerStep[] = [
        CharacterPlannerStep.SET_RACE,
        CharacterPlannerStep.SET_CLASS,
        CharacterPlannerStep.SET_BACKGROUND,
        CharacterPlannerStep.SET_ABILITY_SCORES,
    ];
    pendingDecisions: PendingDecision[] = [];

    constructor(
        public classData: CharacterClassOption[],
        public spellData: ISpell[],
    ) {
        this.updateClassDataEffects();
    }

    multiclassRoot: ICharacterOption = {
        name: 'Add a class',
        // description: 'Add a level in a new class.',
        type: CharacterPlannerStep.MULTICLASS_ROOT,
    };

    name: string = 'Tav';

    // State management =======================================================

    async queueNextStep(): Promise<Character | null> {
        if (!this.pendingSteps.length) {
            return null;
        }

        const step = this.pendingSteps.shift()!;
        const info = CharacterDecisionInfo[step];
        const choices = info?.getChoices
            ? await info.getChoices(this)
            : [{ type: step, options: await info.getOptions!(this) }];

        const parent = new CharacterTreeDecision({
            name: step,
        });

        this.root.addChild(parent);

        choices.forEach((choice) =>
            this.pendingDecisions.push(new PendingDecision(parent, choice)),
        );

        return this.clone();
    }

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
        optionOrOptions: ICharacterOption | ICharacterOption[],
    ): Character {
        const { type } = pending;
        let { parent } = pending;
        this.unqueueDecision(pending as PendingDecision);

        const options: ICharacterOption[] = Array.isArray(optionOrOptions)
            ? optionOrOptions
            : [optionOrOptions];

        options.forEach((option) => {
            if (!parent && Character.LEVEL_STEPS.includes(type)) {
                parent = this.findClassParent(option);
            }

            if (!parent) {
                throw new Error('Could not find parent when making decision');
            }

            if (this.root.findNode((node) => node === parent) === null) {
                throw new Error('Parent exists, but is not found in tree');
            }

            const isProxyChoice =
                option.type === CharacterPlannerStep.MULTICLASS &&
                parent !== this.root;

            if (isProxyChoice) {
                // impose the choices onto the proxied parent
                const targetParent = this.findDecisionByChoiceType(
                    option.type as CharacterPlannerStep,
                )!;
                // FIXME: mutation here MIGHT be dangerous, but we have to keep the same object pointer or the parent won't be found
                targetParent.choices = option.choices;
                this.queueSubchoices(targetParent);
            } else {
                const decision = new CharacterTreeDecision({ type, ...option });
                parent.addChild(decision);
                Character.grantEffects(decision);

                if (Character.LEVEL_STEPS.includes(type)) {
                    this.updateClassDataEffects();
                } else if (
                    type === CharacterPlannerStep.LEARN_CANTRIPS ||
                    type === CharacterPlannerStep.LEARN_SPELLS
                ) {
                    this.updateClassSpellOptions();
                } else if (type === CharacterPlannerStep.CHOOSE_SUBCLASS) {
                    this.collapseSubclassFeatures(decision.name);
                    this.updateClassDataEffects();
                }

                this.queueSubchoices(decision);
            }
        });

        return this.clone();
    }

    clone(): Character {
        return Object.assign(
            new Character(this.classData, this.spellData),
            this,
        );
    }

    private queueSubchoices(parent: CharacterTreeDecision) {
        if (!parent.choices) {
            return;
        }

        parent.choices.forEach((choice) =>
            this.pendingDecisions.unshift(new PendingDecision(parent, choice)),
        );
    }

    private collapseSubclassFeatures(subclassName: string): void {
        this.classData = this.classData.map((cls) => {
            return {
                ...cls,
                progression: cls.progression.map((level) => ({
                    ...level,
                    Features: level.Features.map((feature) => {
                        const choice = feature.choices?.find(
                            (c) =>
                                c.type ===
                                CharacterPlannerStep.SUBCLASS_FEATURE,
                        );

                        if (!choice) {
                            return feature;
                        }

                        const option = choice.options.find(
                            (c) => c.name === subclassName,
                        );

                        // Make sure the subclass we're collapsing exists in these choices
                        if (!option) {
                            return feature;
                        }

                        const choices: ICharacterChoice[] = [];
                        const grants: GrantableEffect[] = [];

                        if (feature.choices) {
                            choices.push(...feature.choices);
                        }

                        if (option.choices) {
                            choices.push(...option.choices);
                        }

                        if (feature.grants) {
                            grants.push(...feature.grants);
                        }

                        if (option.grants) {
                            grants.push(...option.grants);
                        }

                        return {
                            ...feature,
                            choices,
                            grants,
                        };
                    }),
                })),
            };
        });
    }

    private updateClassFeatures(): void {
        const levelInfo = this.getClasses();

        this.classData = this.classData.map((cls) => {
            const level =
                levelInfo.find((info) => info.class.name === cls.name)
                    ?.levels ?? 0;

            if (level >= Character.MAX_LEVEL) {
                return { ...cls };
            }

            const choices = cls.progression[level].Features.flatMap(
                (feature) => feature.choices,
            ).filter(Boolean) as ICharacterChoice[];

            const grants = cls.progression[level].Features.flatMap(
                (feature) => feature.grants,
            ).filter(Boolean) as unknown as GrantableEffect[];

            return {
                ...cls,
                choices,
                grants,
            };
        });
    }

    private updateClassSpellOptions(): void {
        const levelInfo = this.getClasses();
        const keys: (keyof CharacterClassProgressionLevel)[] = [
            'Spells Known',
            'Cantrips Known',
        ];

        this.classData = this.classData.map((cls) => {
            const level =
                levelInfo.find((info) => info.class.name === cls.name)
                    ?.levels ?? 0;

            const currentLevelData = level > 0 && cls.progression[level - 1];
            const nextLevelData = cls.progression[level];

            if (level >= Character.MAX_LEVEL) {
                return { ...cls };
            }

            const choices: ICharacterChoice[] = cls.choices
                ? [...cls.choices]
                : [];

            choices.push(
                ...keys.flatMap((key) => {
                    if (!nextLevelData[key]) {
                        return [];
                    }

                    const step =
                        key === 'Spells Known'
                            ? CharacterPlannerStep.LEARN_SPELLS
                            : CharacterPlannerStep.LEARN_CANTRIPS;

                    const netChoices =
                        ((nextLevelData[key] as number) ?? 0) -
                        (currentLevelData
                            ? (currentLevelData[key] as number)
                            : 0);

                    if (netChoices === 0) {
                        return [];
                    }

                    if (!nextLevelData['Spell Slots']) {
                        throw new Error('class does not have spell slots');
                    }

                    let spells: ISpell[];

                    if (key === 'Spells Known') {
                        const highestSlot =
                            typeof nextLevelData['Spell Slots'] === 'number'
                                ? nextLevelData['Slot Level']!
                                : nextLevelData['Spell Slots'].findLastIndex(
                                      (spellCount) =>
                                          spellCount && spellCount > 0,
                                  );
                        const spellsKnown = this.getKnownSpells(
                            CharacterPlannerStep.LEARN_SPELLS,
                        ).map((effect) => effect.name);

                        spells = this.spellData.filter(
                            (spell) =>
                                spell.classes.includes(cls.name) &&
                                spell.level > 0 &&
                                spell.level <= highestSlot &&
                                !spellsKnown.includes(spell.name),
                        );
                    } else {
                        const cantripsKnown = this.getKnownSpells(
                            CharacterPlannerStep.LEARN_CANTRIPS,
                        ).map((effect) => effect.name);

                        spells = this.spellData.filter(
                            (spell) =>
                                spell.classes.includes(cls.name) &&
                                spell.level === 0 &&
                                !cantripsKnown.includes(spell.name),
                        );
                    }

                    return [
                        {
                            type: step,
                            count: netChoices,
                            options: spells.map(
                                ({ name, description, image }) => ({
                                    name,
                                    description,
                                    image,
                                    type: step,
                                    grants: [
                                        {
                                            name,
                                            description,
                                            type: GrantableEffectType.ACTION,
                                            subtype:
                                                ActionEffectType.SPELL_ACTION,
                                            image,
                                        },
                                    ],
                                }),
                            ),
                        },
                    ];
                }),
            );

            return {
                ...cls,
                choices,
            };
        });
    }

    private updateClassDataEffects(): void {
        this.updateClassFeatures();
        this.updateClassSpellOptions();
    }

    levelUp(): Character {
        if (!this.canLevel()) {
            return this;
        }

        const currentClassNames = (
            this.findAllDecisionsByOptionType([
                CharacterPlannerStep.SET_CLASS,
                CharacterPlannerStep.LEVEL_UP,
                CharacterPlannerStep.MULTICLASS,
            ]).filter(Boolean) as ICharacterTreeDecision[]
        ).map((decision) => decision.name);

        const currentClasses = this.classData.filter((cls) =>
            currentClassNames.includes(cls.name),
        );

        const newClasses = this.classData.filter(
            (cls) => !currentClasses.includes(cls),
        );

        const decision: PendingDecision = new PendingDecision(null, {
            options: [
                ...currentClasses,
                {
                    ...this.multiclassRoot,
                    choices: [
                        {
                            type: CharacterPlannerStep.MULTICLASS,
                            options: newClasses,
                        },
                    ],
                },
            ],
            type: CharacterPlannerStep.LEVEL_UP,
        });

        this.pendingDecisions.unshift(decision);

        return this.clone();
    }

    findClassParent(
        choice: ICharacterOption,
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

        const classes = this.findAllDecisionsByOptionType([
            CharacterPlannerStep.SET_CLASS,
            CharacterPlannerStep.MULTICLASS,
            CharacterPlannerStep.LEVEL_UP,
        ]).filter(Boolean) as ICharacterTreeDecision[];

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
                                    decision.type ===
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
                    CharacteristicType.ABILITY_BASE,
                    CharacteristicType.ABILITY_RACIAL,
                    CharacteristicType.ABILITY_FEAT,
                ].includes(effect.subtype),
        );

        if (abilityFx.length === 0) {
            return null;
        }

        return Object.fromEntries(
            Object.keys(abilityFx[0].values).map((ability) => [
                ability,
                abilityFx.reduce(
                    (acc, effect) => acc + (effect.values?.[ability] ?? 0),
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

    getActions(): ActionEffect[] {
        return this.getGrantedEffects().filter(
            (effect) => effect.type === GrantableEffectType.ACTION,
        ) as ActionEffect[];
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

            // FIXME: Only looks at the first choice which may not work in all situations
            return (
                typeof decision.choices?.[0]?.type !== 'undefined' &&
                (typeof choiceType === 'string'
                    ? decision.choices?.[0].type === choiceType
                    : choiceType.includes(decision.choices?.[0].type))
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

    getKnownSpells(
        type:
            | CharacterPlannerStep.LEARN_CANTRIPS
            | CharacterPlannerStep.LEARN_SPELLS,
    ): GrantableEffect[] {
        return this.findAllDecisionsByOptionType(type).flatMap(
            (decision) => decision.grants!,
        );
    }
}
