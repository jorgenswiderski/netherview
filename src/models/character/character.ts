// character.ts
import {
    ICharacterOption,
    CharacterPlannerStep,
    ICharacterChoice,
} from '@jorgenswiderski/tomekeeper-shared/dist/types/character-feature-customization-option';
import {
    GrantableEffect,
    CharacteristicType,
    GrantableEffectType,
    Proficiency,
    IActionEffect,
    ICharacteristic,
} from '@jorgenswiderski/tomekeeper-shared/dist/types/grantable-effect';
import { ISpell } from '@jorgenswiderski/tomekeeper-shared/dist/types/action';
import {
    EquipmentItemType,
    EquipmentSlot,
    IEquipmentItem,
    IWeaponItem,
    WeaponHandedness,
} from '@jorgenswiderski/tomekeeper-shared/dist/types/equipment-item';
import assert from 'assert';
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
import { characterDecisionInfo, IPendingDecision } from './character-states';
import { CharacterClassProgressionLevel } from '../../api/weave/types';
import {
    CharacterEquipment,
    ICharacterTreeEquipmentItem,
} from '../items/types';
import { CharacterTreeEquipmentItem } from './character-tree-node/character-tree-equipment-item';
import { EquipmentItemFactory } from '../items/equipment-item-factory';
import { CharacterTreeSpell } from './character-tree-node/character-tree-spell';
import { TreeCompressor } from '../tree-compressor';
import { WeaponItem } from '../items/weapon-item';
import { error } from '../logger';
import { safeAssert } from '../utils';

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
        public baseClassData: CharacterClassOption[],
        public spellData: ISpell[],
    ) {}

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
        const info = characterDecisionInfo[step];

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
        const { type, id: choiceId } = pending;
        let { parent } = pending;
        this.unqueueDecision(pending as PendingDecision);

        const options: ICharacterOption[] = Array.isArray(optionOrOptions)
            ? optionOrOptions
            : [optionOrOptions];

        options.forEach((option) => {
            if (option.type === CharacterPlannerStep.STOP_LEVEL_MANAGEMENT) {
                return;
            }

            if (option.type === CharacterPlannerStep.REMOVE_LEVEL) {
                this.removeLevel(option);

                return;
            }

            if (option.type === CharacterPlannerStep.REVISE_LEVEL) {
                this.reviseLevel(option);

                return;
            }

            if (option.type === CharacterPlannerStep.CHANGE_PRIMARY_CLASS) {
                this.changePrimaryClass(option.name);

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
                const decision =
                    option instanceof CharacterTreeDecision
                        ? option
                        : new CharacterTreeDecision(
                              { type, ...option },
                              choiceId,
                          );

                parent.addChild(decision);
                Character.grantEffects(decision);

                this.queueSubchoices(decision, option.choices);
            }
        });

        return this.clone();
    }

    clone(): Character {
        return Object.assign(
            new Character(this.baseClassData, this.spellData),
            this,
        );
    }

    private queueSubchoices(
        parent: CharacterTreeDecision,
        choices?: ICharacterChoice[],
    ) {
        if (!choices) {
            return;
        }

        const pd: PendingDecision[] = [];

        choices.forEach((choice) => {
            const pending = new PendingDecision(parent, choice);

            if (choice.forcedOptions) {
                safeAssert(
                    choice.forcedOptions.length === (choice.count ?? 1),
                    `Number of forced options (${choice.forcedOptions.length}) should equal choice count (${choice.count})`,
                );

                choice.forcedOptions.forEach((option) => {
                    const decision = new CharacterTreeDecision(
                        option,
                        pending.id,
                    );

                    parent.addChild(decision);
                    Character.grantEffects(decision);
                    this.queueSubchoices(decision, option.choices);
                });

                return;
            }

            pd.push(pending);
        });

        this.pendingDecisions.unshift(...pd);
    }

    private static restrictSubclassFeatures(
        subclassNode: CharacterTreeDecision,
        data: CharacterClassOption[],
    ): CharacterClassOption[] {
        return data.map((cls) => {
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
                                    CharacterPlannerStep.SUBCLASS_FEATURE &&
                                choice.options.find(
                                    (option) =>
                                        option.name === subclassNode.name,
                                ),
                        );

                        if (subclassChoices.length === 0) {
                            return feature;
                        }

                        const otherChoices = feature.choices.filter(
                            (choice) => !subclassChoices.includes(choice),
                        );

                        return {
                            ...feature,
                            choices: [
                                ...otherChoices,
                                ...subclassChoices.map((choice) => {
                                    const option = choice.options.find(
                                        (opt) => opt.name === subclassNode.name,
                                    );

                                    if (!option) {
                                        throw new Error(
                                            'could not find option when restricing subclass features',
                                        );
                                    }

                                    return {
                                        ...choice,
                                        forcedOptions: [option],
                                    };
                                }),
                            ],
                        };
                    }),
                })),
            };
        });
    }

    filterWhitelist = new Set(['Ability Improvement']);

    private filterOptions(choice: ICharacterChoice): ICharacterChoice {
        const obtainedOptions = this.findAllDecisionsByType(choice.type);
        const obtainedNames = obtainedOptions.map(({ name }) => name);

        return {
            ...choice,
            options: choice.options.filter(
                (option) =>
                    !obtainedNames.includes(option.name) ||
                    this.filterWhitelist.has(option.name),
            ),
        };
    }

    private updateClassFeatures(
        data: CharacterClassOption[],
    ): ICharacterOption[] {
        const levelInfo = this.getClassInfo();

        return data.map((cls) => {
            const level =
                levelInfo.find((info) => info.class.name === cls.name)?.levels
                    .length ?? 0;

            if (level >= Character.MAX_LEVEL) {
                return { ...cls };
            }

            const { progression, ...rest } = cls;

            const choices = cls.progression[level].Features.map(
                (feature): ICharacterChoice => {
                    const typedFeature = {
                        type: CharacterPlannerStep.CLASS_FEATURE,
                        ...feature,
                        choices: feature.choices?.map((choice) =>
                            this.filterOptions(choice),
                        ),
                    };

                    return {
                        type: CharacterPlannerStep.CLASS_FEATURE,
                        options: [typedFeature],
                        forcedOptions: [typedFeature],
                    };
                },
            );

            return {
                ...rest,
                choices,
                level,
            };
        });
    }

    private getClassProgression(className: string, level: number) {
        return this.baseClassData.find((cls) => cls.name === className)!
            .progression[level - 1];
    }

    private updateClassSpellOptions(
        data: ICharacterOption[],
    ): ICharacterOption[] {
        const levelInfo = this.getClassInfo();

        const keys: (keyof CharacterClassProgressionLevel)[] = [
            'Spells Known',
            'Cantrips Known',
        ];

        return data.map((cls) => {
            const level =
                levelInfo.find((info) => info.class.name === cls.name)?.levels
                    .length ?? 0;

            const currentLevelData =
                level > 0 && this.getClassProgression(cls.name, level);

            const nextLevelData = this.getClassProgression(cls.name, level + 1);

            if (level >= Character.MAX_LEVEL) {
                return { ...cls };
            }

            const spellChoices = keys.flatMap((key) => {
                if (!nextLevelData[key]) {
                    return [];
                }

                const step =
                    key === 'Spells Known'
                        ? CharacterPlannerStep.LEARN_SPELLS
                        : CharacterPlannerStep.LEARN_CANTRIPS;

                const netChoices =
                    ((nextLevelData[key] as number) ?? 0) -
                    (currentLevelData ? (currentLevelData[key] as number) : 0);

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
                                  (spellCount) => spellCount && spellCount > 0,
                              );

                    const spellsKnown = this.getKnownSpells(
                        CharacterPlannerStep.LEARN_SPELLS,
                    ).map((effect) => effect.name);

                    spells = this.spellData.filter(
                        (spell) =>
                            !spell.isVariant &&
                            spell.level > 0 &&
                            spell.level <= highestSlot &&
                            spell.classes.includes(cls.name) &&
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

                // FIXME
                const choiceId = PendingDecision.generateUuid(
                    step,
                    cls.name,
                    CharacterPlannerStep.LEVEL_UP,
                );

                if (spells.length === 0) {
                    error(
                        `Character had no valid candidates to add to the option pool when learning ${
                            step === CharacterPlannerStep.LEARN_CANTRIPS
                                ? 'cantrips'
                                : 'spells'
                        }`,
                    );

                    return [];
                }

                if (spells.length < netChoices) {
                    error(
                        `Warning: Character had fewer valid candidates than choices when learning ${
                            step === CharacterPlannerStep.LEARN_CANTRIPS
                                ? 'cantrips'
                                : 'spells'
                        }`,
                    );

                    return [];
                }

                return [
                    {
                        type: step,
                        count: Math.min(netChoices, spells.length),
                        options: spells.map(
                            (spell) => new CharacterTreeSpell(spell, choiceId),
                        ),
                    },
                ];
            });

            return {
                ...cls,
                choices: [...(cls.choices ?? []), ...spellChoices],
            };
        });
    }

    getCurrentClassData(): ICharacterOption[] {
        const subclassNodes = this.findAllDecisionsByType(
            CharacterPlannerStep.CHOOSE_SUBCLASS,
        );

        let data = this.baseClassData;

        subclassNodes.forEach((node) => {
            data = Character.restrictSubclassFeatures(node, data);
        });

        const options = this.updateClassFeatures(data);

        return this.updateClassSpellOptions(options);
    }

    levelUp(): Character {
        if (!this.canLevel()) {
            return this;
        }

        const classData = this.getCurrentClassData();

        const currentClassNodes = this.findAllDecisionsByType([
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

        const currentClasses = classData.filter((cls) =>
            isChoosingPrimaryClass
                ? !currentClassNames.includes(cls.name)
                : currentClassNames.includes(cls.name),
        );

        const newClasses = isChoosingPrimaryClass
            ? []
            : classData.filter((cls) => !currentClasses.includes(cls));

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
            type: isChoosingPrimaryClass
                ? CharacterPlannerStep.PRIMARY_CLASS
                : CharacterPlannerStep.LEVEL_UP,
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

        // eslint-disable-next-line no-param-reassign
        delete node.grants;
    }

    removeLevel(option: ICharacterOption): void {
        const { node: target } = option as ICharacterOption & {
            node: CharacterTreeDecision;
        };

        const parent = this.findNodeParent(target) as CharacterTreeNode;

        if (!target || !parent) {
            throw new Error('failed to remove level');
        }

        parent.removeChild(target);
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

    replayNodes?: CharacterTreeDecision;

    reviseLevel(option: ICharacterOption): void {
        const { node: target } = option as ICharacterOption & {
            node: CharacterTreeDecision;
        };

        const parentNode = this.findNodeParent(target);
        const parent = parentNode as ICharacterTreeDecision;

        if (!target || !parent) {
            throw new Error('failed to remove level');
        }

        // Splice the children from the parent node
        const targetIndex = parent.children!.findIndex(
            (node) => node === target,
        );

        parent.children!.splice(targetIndex, 1);

        // Trigger a level up in the removed class
        this.levelUpClass(target.name, target.type);

        // Get the tree of the subsequent levels of the old node
        const subsequentLevels = target.children?.find(
            (node) => node.type === CharacterPlannerStep.LEVEL_UP,
        ) as CharacterTreeDecision;

        if (!subsequentLevels) {
            return;
        }

        assert(
            typeof this.replayNodes === 'undefined',
            'Replay should not already be in progress',
        );

        this.replayNodes = subsequentLevels;
    }

    levelUpClass(className: string, levelUpType?: CharacterPlannerStep): void {
        this.levelUp();
        let levelDecision = this.pendingDecisions[0];

        if (levelUpType === CharacterPlannerStep.SECONDARY_CLASS) {
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
            (opt) => opt.name === className,
        )!;

        this.makeDecision(levelDecision, classOption);
    }

    progressReplay(): Character {
        if (!this.replayNodes) {
            return this;
        }

        const levelNode = this.replayNodes;

        assert(
            levelNode.type && Character.LEVEL_STEPS.includes(levelNode.type),
        );

        const classInfo = this.getClassInfo().find(
            (cls) => cls.class.name === levelNode.name,
        )!;

        if (classInfo.levels.length <= (levelNode as any).level) {
            this.levelUpClass(levelNode.name, levelNode.type);
        }

        if (!levelNode.children) {
            return this.clone();
        }

        function flattenDecisions(
            decisions: CharacterTreeDecision[],
        ): CharacterTreeDecision[] {
            const childDecisions = decisions
                .filter((node) => node.children)
                .flatMap((node) => node.children)
                .filter(
                    (node) => node?.nodeType === CharacterTreeNodeType.DECISION,
                ) as CharacterTreeDecision[];

            return [
                ...decisions,
                ...(childDecisions.length > 0
                    ? flattenDecisions(childDecisions)
                    : []),
            ];
        }

        const pastChildren = (
            levelNode.children.filter(
                (child) => child.nodeType === CharacterTreeNodeType.DECISION,
            ) as CharacterTreeDecision[]
        ).filter(
            (node) => !(node.type && Character.LEVEL_STEPS.includes(node.type)),
        );

        const pastDecisions = flattenDecisions(pastChildren);

        function getFastforwardableDecisions(
            pending: PendingDecision[],
            past: CharacterTreeDecision[],
        ): Map<PendingDecision, { name: string }[]> {
            const map = new Map<PendingDecision, { name: string }[]>();

            pending.forEach((decision) => {
                const pastDecision = past.filter(
                    (pDec) => pDec.choiceId === decision.id,
                );

                if (pastDecision.length !== decision.count) {
                    return;
                }

                if (
                    !pastDecision.every((p) =>
                        decision.options.find(
                            (option) => option.name === p.name,
                        ),
                    )
                ) {
                    return;
                }

                if (
                    decision.forcedOptions &&
                    !pastDecision.every((p) =>
                        decision.forcedOptions!.find(
                            (option) => option.name === p.name,
                        ),
                    )
                ) {
                    return;
                }

                map.set(decision, pastDecision);
            });

            return map;
        }

        let fastforwards = getFastforwardableDecisions(
            this.pendingDecisions,
            pastDecisions,
        );

        while (fastforwards.size > 0) {
            [...fastforwards.entries()].forEach(([pending, past]) => {
                const option = past.map(
                    (p) => pending.options.find((opt) => opt.name === p.name)!,
                );

                this.makeDecision(pending, option);
            });

            fastforwards = getFastforwardableDecisions(
                this.pendingDecisions,
                pastDecisions,
            );
        }

        if (this.pendingDecisions.length === 0) {
            this.replayNodes = levelNode.children.find(
                (child) => child.name === levelNode.name,
            ) as CharacterTreeDecision | undefined;

            if (this.replayNodes) {
                return this.progressReplay();
            }
        }

        return this.clone();
    }

    changePrimaryClass(className: string): void {
        const target: CharacterTreeDecision | null = this.root.findNode(
            (node) =>
                node.name === className &&
                node.nodeType === CharacterTreeNodeType.DECISION &&
                (node as CharacterTreeDecision).type ===
                    CharacterPlannerStep.SECONDARY_CLASS,
        ) as CharacterTreeDecision | null;

        const original = this.findDecisionByType(
            CharacterPlannerStep.PRIMARY_CLASS,
        );

        if (!target || !original) {
            throw new Error('could not find classes to swap');
        }

        target.type = CharacterPlannerStep.PRIMARY_CLASS;
        original.type = CharacterPlannerStep.SECONDARY_CLASS;
    }

    getEquipment(): CharacterEquipment {
        const nodes = this.findAllDecisionsByType(
            CharacterPlannerStep.EQUIP_ITEM,
        ) as ICharacterTreeEquipmentItem[];

        return Object.fromEntries(
            nodes.map((node) => [node.equipmentSlot, node]),
        ) as Record<EquipmentSlot, ICharacterTreeEquipmentItem>;
    }

    equipItem(slot: EquipmentSlot, item: IEquipmentItem): Character {
        const equipment = this.getEquipment();

        const oldNode = equipment[slot];

        if (oldNode) {
            this.root.removeChild(oldNode);
        }

        const node = new CharacterTreeEquipmentItem(
            slot,
            EquipmentItemFactory.construct(item),
        );

        this.root.addChild(node);

        if (
            slot === EquipmentSlot.MeleeMainhand ||
            slot === EquipmentSlot.RangedMainhand
        ) {
            const offhandNode =
                equipment[
                    slot === EquipmentSlot.MeleeMainhand
                        ? EquipmentSlot.MeleeOffhand
                        : EquipmentSlot.RangedOffhand
                ];

            if (
                offhandNode &&
                (!this.canUseOffhand(slot) ||
                    (!this.canDualWield() &&
                        offhandNode.item.type !== EquipmentItemType.Shields))
            ) {
                this.root.removeChild(offhandNode);
            }
        }

        return this.clone();
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
            }) as CharacterTreeDecision[];

        const effects: GrantableEffect[] = childrenExcludingLevelUps.flatMap(
            (child) =>
                child.findAllNodes(
                    (node) => node.nodeType === CharacterTreeNodeType.EFFECT,
                ),
        ) as unknown as GrantableEffect[];

        return effects;
    }

    getClassInfo(): CharacterClassInfo[] {
        const allNodes = this.findAllDecisionsByType([
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
            class: this.baseClassData.find((cls) => cls.name === name)!,
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
        const fx: GrantableEffect[] = this.root.findAllNodes(
            (node) => node.nodeType === CharacterTreeNodeType.EFFECT,
        ) as CharacterTreeEffect[] as GrantableEffect[];

        // FIXME: Remove this once its clear that nodes is always empty
        const nodes = this.root.findAllNodes(
            (node) =>
                node.nodeType === CharacterTreeNodeType.DECISION &&
                typeof (node as CharacterTreeDecision).grants !== 'undefined',
        );

        assert(nodes.length === 0);

        fx.push(
            ...nodes.flatMap((node) => (node as CharacterTreeDecision).grants!),
        );

        return fx;
    }

    getProficiencies(): Proficiency[] {
        // TODO: remove duplicates in a graceful way
        return this.getGrantedEffects().filter(
            (effect) => effect.type === GrantableEffectType.PROFICIENCY,
        ) as Proficiency[];
    }

    getActions(): IActionEffect[] {
        return this.getGrantedEffects().filter(
            (effect) => effect.type === GrantableEffectType.ACTION,
        ) as IActionEffect[];
    }

    getCharacteristics(): ICharacteristic[] {
        return this.getGrantedEffects().filter(
            (effect) => effect.type === GrantableEffectType.CHARACTERISTIC,
        ) as ICharacteristic[];
    }

    getFeats(): CharacterTreeDecision[] {
        return this.findAllDecisionsByType(CharacterPlannerStep.FEAT);
    }

    static getFeatAsEffect(featNode: CharacterTreeDecision): GrantableEffect {
        safeAssert(featNode.type === CharacterPlannerStep.FEAT);

        const { name, description, image } = featNode;

        const featEffect = featNode.findNode(
            (effect) =>
                effect.nodeType === CharacterTreeNodeType.EFFECT &&
                effect.name === name &&
                (effect as CharacterTreeEffect).type ===
                    GrantableEffectType.CHARACTERISTIC,
        ) as CharacterTreeEffect | undefined as GrantableEffect | undefined;

        if (featEffect) {
            return featEffect;
        }

        const featDummyEffect: GrantableEffect = {
            name,
            description,
            image,
            type: GrantableEffectType.CHARACTERISTIC, // FIXME
        };

        return featDummyEffect;
    }

    getFeatsAsEffects(): GrantableEffect[] {
        return this.getFeats().map(Character.getFeatAsEffect);
    }

    private static findNodeByType(
        type: CharacterPlannerStep | CharacterPlannerStep[],
    ): (node: ICharacterTreeNode) => boolean {
        return (node: ICharacterTreeNode) => {
            if (node.nodeType !== CharacterTreeNodeType.DECISION) {
                return false;
            }

            const decision = node as CharacterTreeDecision;

            return (
                typeof decision.type !== 'undefined' &&
                (typeof type === 'number'
                    ? decision.type === type
                    : type.includes(decision.type))
            );
        };
    }

    private findDecisionByType(
        type: CharacterPlannerStep | CharacterPlannerStep[],
    ): CharacterTreeDecision | null {
        return this.root.findNode(
            Character.findNodeByType(type),
        ) as CharacterTreeDecision | null;
    }

    private findAllDecisionsByType(
        type: CharacterPlannerStep | CharacterPlannerStep[],
    ): CharacterTreeDecision[] {
        return this.root.findAllNodes(
            Character.findNodeByType(type),
        ) as CharacterTreeDecision[];
    }

    private findNodeParent(child: CharacterTreeDecision | CharacterTreeEffect) {
        return this.root.findNode(
            (node) => node.children?.includes(child) ?? false,
        );
    }

    getRace(): ICharacterTreeDecision | undefined {
        return (
            this.findDecisionByType(CharacterPlannerStep.SET_RACE) ?? undefined
        );
    }

    getSubrace(): ICharacterTreeDecision | undefined {
        return (
            this.findDecisionByType(CharacterPlannerStep.CHOOSE_SUBRACE) ??
            undefined
        );
    }

    getBackground(): ICharacterTreeDecision | undefined {
        return this.findDecisionByType(CharacterPlannerStep.SET_BACKGROUND) as
            | ICharacterTreeDecision
            | undefined;
    }

    getKnownSpells(
        type:
            | CharacterPlannerStep.LEARN_CANTRIPS
            | CharacterPlannerStep.LEARN_SPELLS,
    ): GrantableEffect[] {
        return this.findAllDecisionsByType(type).flatMap(
            (decision) => decision.children!,
        ) as GrantableEffect[];
    }

    canDualWield(): boolean {
        const equipment = this.getEquipment();
        const weaponNode = equipment[EquipmentSlot.MeleeMainhand];
        const weapon = weaponNode?.item as WeaponItem | undefined;

        return !weapon || this.getDualWieldFilter()(weapon);
    }

    canUseOffhand(
        slot: EquipmentSlot.MeleeMainhand | EquipmentSlot.RangedMainhand,
    ): boolean {
        const equipment = this.getEquipment();
        const weaponNode = equipment[slot];
        const weapon = weaponNode?.item as WeaponItem | undefined;

        return weapon?.handedness !== WeaponHandedness['two-handed'];
    }

    getFeatByName(featName: string): CharacterTreeDecision | null {
        return this.root.findNode((node) => {
            if (node.nodeType !== CharacterTreeNodeType.DECISION) {
                return false;
            }

            const decision = node as CharacterTreeDecision;

            return (
                decision.type === CharacterPlannerStep.FEAT &&
                featName === decision.name
            );
        }) as CharacterTreeDecision | null;
    }

    private getDualWieldFilter(): (weapon: IWeaponItem) => boolean {
        if (this.getFeatByName('Dual Wielder')) {
            return (weapon: IWeaponItem) => !weapon.cantDualWield;
        }

        return (weapon: IWeaponItem) => weapon.light && !weapon.cantDualWield;
    }

    getEquipmentSlotFilters(): Record<
        number,
        (item: IEquipmentItem) => boolean
    > {
        const dwFilter = this.getDualWieldFilter();
        const canDwMelee = this.canDualWield();

        return {
            [EquipmentSlot.MeleeOffhand]: (item: IEquipmentItem) =>
                item.type === EquipmentItemType.Shields ||
                (canDwMelee && dwFilter(item as IWeaponItem)),
            [EquipmentSlot.RangedOffhand]: (item) =>
                dwFilter(item as IWeaponItem),
        };
    }

    getEquipmentSlotDisableStatus(): Record<number, boolean> {
        return {
            [EquipmentSlot.MeleeOffhand]: !this.canUseOffhand(
                EquipmentSlot.MeleeMainhand,
            ),
            [EquipmentSlot.RangedOffhand]: !this.canUseOffhand(
                EquipmentSlot.RangedMainhand,
            ),
        };
    }

    // Import / Export ========================================================

    canExport(): boolean {
        return (
            this.pendingSteps.length === 0 &&
            (this.pendingDecisions.length === 0 ||
                (this.pendingDecisions.length === 1 &&
                    this.pendingDecisions[0].type ===
                        CharacterPlannerStep.MANAGE_LEVELS))
        );
    }

    async export(validate?: boolean): Promise<string> {
        return TreeCompressor.deflate(this.root, validate);
    }

    private static transformToClassTree(
        node: ICharacterTreeNode,
    ): CharacterTreeNode {
        if (node instanceof CharacterTreeNode) {
            // Object was already turned into a class via StaticReference or RecordCompressor
            return node as CharacterTreeNode;
        }

        const { children, ...rest } = node;
        let NodeConstructor: new (...args: any[]) => CharacterTreeNode;

        if (node.nodeType === CharacterTreeNodeType.DECISION) {
            NodeConstructor = CharacterTreeDecision;
        } else {
            NodeConstructor = CharacterTreeEffect;
        }

        const nodeClassBased = new NodeConstructor({ name: node.name });
        Object.assign(nodeClassBased, rest);

        if (children) {
            children.forEach((child) => {
                nodeClassBased.addChild(
                    Character.transformToClassTree(child) as
                        | CharacterTreeEffect
                        | CharacterTreeDecision,
                );
            });
        }

        return nodeClassBased;
    }

    static async import(
        importStr: string,
        classData: CharacterClassOption[],
        spellData: ISpell[],
    ): Promise<Character> {
        const root = await TreeCompressor.inflate(importStr);
        const char = new Character(classData, spellData);
        char.pendingDecisions.length = 0;
        char.pendingSteps.length = 0;
        char.root = Character.transformToClassTree(root) as CharacterTreeRoot;

        return char;
    }
}
