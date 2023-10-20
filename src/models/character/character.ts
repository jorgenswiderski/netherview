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
import {
    AbilityScores,
    CharacterClassInfo,
    CharacterClassOption,
    ICharacter,
} from './types';
import { PendingDecision } from './pending-decision/pending-decision';
import {
    CharacterTreeDecision,
    CharacterTreeEffect,
    CharacterTreeNode,
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
        CharacterPlannerStep.SECONDARY_CLASS,
        CharacterPlannerStep.PRIMARY_CLASS,
    ];
    static LEVEL_ROOTS = [
        CharacterPlannerStep.SECONDARY_CLASS,
        CharacterPlannerStep.PRIMARY_CLASS,
    ];

    root: CharacterTreeRoot = new CharacterTreeRoot();

    pendingSteps: CharacterPlannerStep[] = [
        CharacterPlannerStep.SET_RACE,
        CharacterPlannerStep.PRIMARY_CLASS,
        CharacterPlannerStep.SET_BACKGROUND,
        CharacterPlannerStep.SET_ABILITY_SCORES,
    ];
    pendingDecisions: PendingDecision[] = [];

    constructor(
        public classData: CharacterClassOption[],
        public spellData: ISpell[],
    ) {
        this.updateClassData();
    }

    multiclassRoot: ICharacterOption = {
        name: 'Add a class',
        // description: 'Add a level in a new class.',
        type: CharacterPlannerStep.MULTICLASS_PROXY,
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

        choices.forEach((choice) =>
            this.pendingDecisions.push(new PendingDecision(this.root, choice)),
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
            if (option.type === CharacterPlannerStep.REMOVE_LEVEL) {
                this.removeLevel(option);

                return;
            }

            if (option.type === CharacterPlannerStep.REVISE_LEVEL) {
                this.reviseLevel(option);

                return;
            }

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
                option.type === CharacterPlannerStep.MULTICLASS_PROXY;

            if (isProxyChoice) {
                this.pendingDecisions.unshift(
                    ...option.choices!.map(
                        (choice) => new PendingDecision(this.root, choice),
                    ),
                );
            } else {
                const decision = new CharacterTreeDecision({ type, ...option });
                parent.addChild(decision);
                Character.grantEffects(decision);

                if (Character.LEVEL_STEPS.includes(type)) {
                    this.updateClassData();
                } else if (
                    type === CharacterPlannerStep.LEARN_CANTRIPS ||
                    type === CharacterPlannerStep.LEARN_SPELLS
                ) {
                    this.updateClassSpellOptions();
                } else if (type === CharacterPlannerStep.CHOOSE_SUBCLASS) {
                    this.collapseSubclassFeatures(decision.name);
                    this.updateClassData();
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

        this.pendingDecisions.unshift(
            ...parent.choices.map(
                (choice) => new PendingDecision(parent, choice),
            ),
        );
    }

    private collapseSubclassFeatures(subclassName: string): void {
        this.classData = this.classData.map((cls) => {
            return {
                ...cls,
                progression: cls.progression.map((level) => ({
                    ...level,
                    Features: level.Features.map((feature) => {
                        if (!feature.choices) {
                            return feature;
                        }

                        const subclassChoices = feature.choices.filter(
                            (choice) =>
                                choice.type ===
                                CharacterPlannerStep.SUBCLASS_FEATURE,
                        );

                        if (subclassChoices.length === 0) {
                            return feature;
                        }

                        const options = subclassChoices.flatMap((choice) =>
                            choice.options.filter(
                                (option) => option.name === subclassName,
                            ),
                        );

                        // Make sure the subclass we're collapsing exists in these choices
                        if (options.length === 0) {
                            return feature;
                        }

                        const otherChoices = feature.choices.filter(
                            (choice) =>
                                choice.type !==
                                CharacterPlannerStep.SUBCLASS_FEATURE,
                        );

                        const choices: ICharacterChoice[] = [...otherChoices];

                        choices.push(
                            ...options.flatMap(
                                (option) => option?.choices ?? [],
                            ),
                        );

                        const grants: GrantableEffect[] = feature.grants
                            ? [...feature.grants]
                            : [];

                        grants.push(
                            ...options.flatMap(
                                (option) => option?.grants ?? [],
                            ),
                        );

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
        const levelInfo = this.getClassInfo();

        this.classData = this.classData.map((cls) => {
            const level =
                levelInfo.find((info) => info.class.name === cls.name)?.levels
                    .length ?? 0;

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
                level,
            };
        });
    }

    private updateClassSpellOptions(): void {
        const levelInfo = this.getClassInfo();
        const keys: (keyof CharacterClassProgressionLevel)[] = [
            'Spells Known',
            'Cantrips Known',
        ];

        this.classData = this.classData.map((cls) => {
            const level =
                levelInfo.find((info) => info.class.name === cls.name)?.levels
                    .length ?? 0;

            const currentLevelData = level > 0 && cls.progression[level - 1];
            const nextLevelData = cls.progression[level];

            if (level >= Character.MAX_LEVEL) {
                return { ...cls };
            }

            const choices: ICharacterChoice[] = nextLevelData.Features.flatMap(
                (feature) => feature.choices ?? [],
            );

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

    private updateClassData(): void {
        this.updateClassFeatures();
        this.updateClassSpellOptions();
    }

    levelUp(): Character {
        if (!this.canLevel()) {
            return this;
        }

        const currentClassNodes = this.findAllDecisionsByOptionType([
            CharacterPlannerStep.PRIMARY_CLASS,
            CharacterPlannerStep.LEVEL_UP,
            CharacterPlannerStep.SECONDARY_CLASS,
        ]) as ICharacterTreeDecision[];

        const isChoosingPrimaryClass = currentClassNodes.every(
            (cls) => cls.type !== CharacterPlannerStep.PRIMARY_CLASS,
        );

        const currentClassNames = currentClassNodes.map(
            (decision) => decision.name,
        );

        const currentClasses = this.classData.filter((cls) =>
            isChoosingPrimaryClass
                ? !currentClassNames.includes(cls.name)
                : currentClassNames.includes(cls.name),
        );

        const newClasses = isChoosingPrimaryClass
            ? []
            : this.classData.filter((cls) => !currentClasses.includes(cls));

        const multiclassOption =
            newClasses.length > 0
                ? [
                      {
                          ...this.multiclassRoot,
                          choices: [
                              {
                                  type: CharacterPlannerStep.SECONDARY_CLASS,
                                  options: newClasses,
                              },
                          ],
                      },
                  ]
                : [];

        const decision: PendingDecision = new PendingDecision(null, {
            options: [...currentClasses, ...multiclassOption],
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

    removeLevel(option: ICharacterOption): void {
        const { node: target } = option as ICharacterOption & {
            node: CharacterTreeDecision;
        };

        const parent = this.findNodeParent(target) as ICharacterTreeDecision;

        if (!target || !parent) {
            throw new Error('failed to remove level');
        }

        parent.children!.splice(
            parent.children!.findIndex((node) => node === target),
        );

        this.updateClassData();
        // FIXME: Need to uncollapse subclass features somehow
    }

    manageLevels(): Character {
        this.pendingDecisions.push(
            new PendingDecision(
                null,
                {
                    type: CharacterPlannerStep.MANAGE_LEVELS,
                    options: [],
                },
                true,
            ),
        );

        return this.clone();
    }

    pendingGraftedNodes?: CharacterTreeDecision;

    reviseLevel(option: ICharacterOption): void {
        const { node: target } = option as ICharacterOption & {
            node: CharacterTreeDecision;
        };

        const parent = this.findNodeParent(target) as ICharacterTreeDecision;

        if (!target || !parent) {
            throw new Error('failed to remove level');
        }

        // Splice the children from the parent node
        const targetIndex = parent.children!.findIndex(
            (node) => node === target,
        );
        parent.children!.splice(targetIndex, 1);

        // Update the effects of the level we're about to grant
        this.updateClassData();

        // Trigger a level up in the removed class
        this.levelUp();
        let levelDecision = this.pendingDecisions[0];

        if (target.type === CharacterPlannerStep.SECONDARY_CLASS) {
            // make the multiclass sub-decision
            const multiclassOption = levelDecision.options.find(
                (opt) => opt.type === CharacterPlannerStep.MULTICLASS_PROXY,
            );

            if (!multiclassOption) {
                throw new Error(
                    'could not find proper option when revising level',
                );
            }

            this.makeDecision(levelDecision, multiclassOption);
            levelDecision = this.pendingDecisions[0];
        }

        const classOption = levelDecision.options.find(
            (opt) => opt.name === target.name,
        )!;

        this.makeDecision(levelDecision, classOption);

        // Get the tree of the subsequent levels of the old node
        const subsequentLevels = target.children?.find(
            (node) => node.type === CharacterPlannerStep.LEVEL_UP,
        ) as CharacterTreeDecision;

        if (!subsequentLevels) {
            return;
        }

        // Find the replacement node
        const replacementNode: CharacterTreeDecision = parent.children?.find(
            (node) => node.name === target.name,
        )! as CharacterTreeDecision;

        // Graft the children back on to the new node
        replacementNode.addChild(subsequentLevels);
    }

    finishGraft(parent: CharacterTreeDecision): void {
        if (!this.pendingGraftedNodes) {
            throw new Error('graft called in invalid state');
        }

        parent.addChild(this.pendingGraftedNodes);
        this.pendingGraftedNodes = undefined;
    }

    // "Getters" for front end ================================================

    // eslint-disable-next-line class-methods-use-this
    canLevel(): boolean {
        return this.getTotalLevel() < Character.MAX_LEVEL;
    }

    private static findSubclassNode(
        classLevels: ICharacterTreeDecision[],
    ): CharacterTreeDecision | undefined {
        const children = classLevels.flatMap((cls) => cls.children ?? []);

        const subclass = children.find((node) => {
            if (node.nodeType !== CharacterTreeNodeType.DECISION) {
                return false;
            }

            const decision = node as CharacterTreeDecision;

            return decision.type === CharacterPlannerStep.CHOOSE_SUBCLASS;
        });

        return subclass as CharacterTreeDecision | undefined;
    }

    private static getClassLevelEffects(
        root: ICharacterTreeDecision,
    ): GrantableEffect[] {
        if (!root.children) {
            return [];
        }

        const childrenExcludingLevelUps: CharacterTreeNode[] =
            root.children.filter((child) => {
                if (child.nodeType !== CharacterTreeNodeType.DECISION) {
                    return true;
                }

                const decision = child as CharacterTreeDecision;

                return decision.type !== CharacterPlannerStep.LEVEL_UP;
            }) as CharacterTreeNode[];

        const effects: GrantableEffect[] = childrenExcludingLevelUps.flatMap(
            (child) =>
                child.findAllNodes(
                    (node) => node.nodeType === CharacterTreeNodeType.EFFECT,
                ),
        ) as unknown as GrantableEffect[];

        return effects;
    }

    getClassInfo(): CharacterClassInfo[] {
        const allNodes = this.findAllDecisionsByOptionType([
            CharacterPlannerStep.PRIMARY_CLASS,
            CharacterPlannerStep.SECONDARY_CLASS,
            CharacterPlannerStep.LEVEL_UP,
        ]).filter(Boolean) as ICharacterTreeDecision[];

        const levelNodes: Record<string, ICharacterTreeDecision[]> = {};

        allNodes.forEach((node) => {
            if (!levelNodes[node.name]) {
                levelNodes[node.name] = [];
            }

            levelNodes[node.name].push(node);
        });

        // sort by levels
        Object.values(levelNodes).forEach((nodes) =>
            nodes.sort((a: any, b: any) => a.level - b.level),
        );

        const info = Object.entries(levelNodes).map(([name, nodes]) => ({
            class: this.classData.find((cls) => cls.name === name)!,
            subclass: Character.findSubclassNode(nodes),
            levels: nodes.map((node) => ({
                node: node as CharacterTreeDecision,
                totalEffects: Character.getClassLevelEffects(node),
            })),
        }));

        info.sort((a, b) => {
            // If one of the classes is the main class, prioritize it
            if (a.levels[0]!.node.type === CharacterPlannerStep.PRIMARY_CLASS) {
                return -1;
            }

            if (b.levels[0]!.node.type === CharacterPlannerStep.PRIMARY_CLASS) {
                return 1;
            }

            // For all other classes, sort by the number of levels in descending order
            return b.levels.length - a.levels.length;
        });

        return info;
    }

    getTotalLevel(): number {
        return this.getClassInfo().reduce(
            (acc, { levels }) => acc + levels.length,
            0,
        );
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

    private findNodeParent(child: CharacterTreeDecision | CharacterTreeEffect) {
        return this.root.findNode(
            (node) => node.children?.includes(child) ?? false,
        );
    }

    getRace(): ICharacterTreeDecision | undefined {
        return (
            this.findDecisionByOptionType(CharacterPlannerStep.SET_RACE) ??
            undefined
        );
    }

    getSubrace(): ICharacterTreeDecision | undefined {
        return (
            this.findDecisionByOptionType(
                CharacterPlannerStep.CHOOSE_SUBRACE,
            ) ?? undefined
        );
    }

    getBackground(): ICharacterTreeDecision | undefined {
        return this.findDecisionByOptionType(
            CharacterPlannerStep.SET_BACKGROUND,
        ) as ICharacterTreeDecision | undefined;
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
