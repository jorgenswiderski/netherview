/* eslint-disable max-classes-per-file */
// character-tree.ts
import {
    CharacterPlannerStep,
    ICharacterOption,
} from '@jorgenswiderski/tomekeeper-shared/dist/types/character-feature-customization-option';
import {
    GrantableEffect,
    GrantableEffectType,
} from '@jorgenswiderski/tomekeeper-shared/dist/types/grantable-effect';
import {
    CharacterTreeNodeType,
    ICharacterTreeDecision,
    ICharacterTreeEffect,
    ICharacterTreeNode,
    ICharacterTreeRoot,
    TraversalMethod,
} from './types';

export class CharacterTreeNode implements ICharacterTreeNode {
    constructor(
        public name: string,
        public nodeType: CharacterTreeNodeType,
        public children?: (CharacterTreeDecision | CharacterTreeEffect)[],
    ) {
        children?.forEach((child) => {
            // eslint-disable-next-line no-param-reassign
            child.parent = this;
        });
    }

    addChild(node: CharacterTreeDecision | CharacterTreeEffect): void {
        if (!this.children) {
            this.children = [];
        }

        // eslint-disable-next-line no-param-reassign
        node.parent = this;
        this.children.push(node);
    }

    removeChild(node: CharacterTreeDecision | CharacterTreeEffect): void {
        if (this.children) {
            const index = this.children.indexOf(node);

            if (index !== -1) {
                this.children.splice(index, 1);
            } else {
                throw new Error(
                    `failed to remove ${node.name} from ${this.name}`,
                );
            }
        }
    }

    findNode(
        discriminator: (node: ICharacterTreeNode) => boolean,
        method: TraversalMethod = TraversalMethod.BreadthFirst,
        maxDepth?: number,
    ): ICharacterTreeNode | null {
        if (discriminator(this)) {
            return this;
        }

        if (method === TraversalMethod.BreadthFirst) {
            return this.breadthFirstSearch(discriminator, true, maxDepth);
        }

        return this.depthFirstSearch(discriminator, true, maxDepth);
    }

    findAllNodes(
        discriminator: (node: ICharacterTreeNode) => boolean,
        maxDepth?: number,
    ): ICharacterTreeNode[] {
        const results: ICharacterTreeNode[] = [];

        this.breadthFirstSearch(
            (node) => {
                if (discriminator(node)) results.push(node);
            },
            false,
            maxDepth,
        );

        return results;
    }

    private breadthFirstSearch(
        callback: (node: ICharacterTreeNode) => boolean | void,
        earlyExit: boolean = false,
        maxDepth?: number,
    ): ICharacterTreeNode | null {
        let queue: [ICharacterTreeNode, number][] = [[this, 0]];

        while (queue.length > 0) {
            const nextQueue: [ICharacterTreeNode, number][] = [];

            const foundNode = CharacterTreeNode.processNodesBFS(
                queue,
                callback,
                nextQueue,
                earlyExit,
                maxDepth,
            );

            if (foundNode) {
                return foundNode;
            }

            queue = nextQueue;
        }

        return null;
    }

    private static processNodesBFS(
        queue: [ICharacterTreeNode, number][],
        callback: (node: ICharacterTreeNode) => boolean | void,
        nextQueue: [ICharacterTreeNode, number][],
        earlyExit: boolean,
        maxDepth?: number,
    ): ICharacterTreeNode | null {
        let foundNode: ICharacterTreeNode | null = null;

        queue.forEach(([current, depth]) => {
            if (maxDepth !== undefined && depth > maxDepth) return;

            if (callback(current) && earlyExit) {
                // eslint-disable-next-line no-param-reassign
                foundNode = current;

                return;
            }

            if (current.children) {
                const childPairs = current.children.map(
                    (child) =>
                        [child, depth + 1] as [ICharacterTreeNode, number],
                );

                nextQueue.push(...childPairs);
            }
        });

        return foundNode;
    }

    private depthFirstSearch(
        callback: (node: ICharacterTreeNode) => boolean | void,
        earlyExit: boolean = false,
        maxDepth?: number,
    ): ICharacterTreeNode | null {
        let stack: [ICharacterTreeNode, number][] = [[this, 0]];
        let foundNode: ICharacterTreeNode | null = null; // Moved the initialization of foundNode to be mutable

        while (stack.length > 0) {
            const nextStack: [ICharacterTreeNode, number][] = [];

            // Capture the returned value to update foundNode
            foundNode = CharacterTreeNode.processNodesDFS(
                stack,
                callback,
                nextStack,
                earlyExit,
                maxDepth,
            );

            if (foundNode) {
                return foundNode;
            }

            stack = nextStack.reverse();
        }

        return null;
    }

    private static processNodesDFS(
        stack: [ICharacterTreeNode, number][],
        callback: (node: ICharacterTreeNode) => boolean | void,
        nextStack: [ICharacterTreeNode, number][],
        earlyExit: boolean,
        maxDepth?: number,
    ): ICharacterTreeNode | null {
        // Return type is updated to ICharacterTreeNode | null
        let foundNode: ICharacterTreeNode | null = null;

        stack.forEach(([current, depth]) => {
            if (maxDepth !== undefined && depth > maxDepth) return;

            if (callback(current) && earlyExit) {
                // eslint-disable-next-line no-param-reassign
                foundNode = current;

                return;
            }

            if (current.children) {
                const childPairs = current.children.map(
                    (child) =>
                        [child, depth + 1] as [ICharacterTreeNode, number],
                );

                nextStack.push(...childPairs);
            }
        });

        return foundNode;
    }
}

export class CharacterTreeRoot
    extends CharacterTreeNode
    implements ICharacterTreeRoot
{
    nodeType: CharacterTreeNodeType.ROOT;

    constructor() {
        super('ROOT', CharacterTreeNodeType.ROOT);

        this.nodeType = CharacterTreeNodeType.ROOT;
    }
}

class CharacterTreeChildNode extends CharacterTreeNode {
    parent?: ICharacterTreeNode;

    constructor(
        public name: string,
        public nodeType: CharacterTreeNodeType,
        public children?: (CharacterTreeDecision | CharacterTreeEffect)[],
    ) {
        super(name, nodeType, children);
    }

    // Allow descendants to override in whatever manner they would like
    // (eg static references of compressed records)
    toJSON(): any {
        // omit parent to avoid cyclic object structure
        const { parent, ...rest } = this;

        return rest;
    }
}

export class CharacterTreeDecision
    extends CharacterTreeChildNode
    implements ICharacterTreeDecision
{
    nodeType: CharacterTreeNodeType.DECISION;

    description?: string;
    image?: string;
    grants?: GrantableEffect[];
    type?: CharacterPlannerStep;
    choices?: undefined;
    numChoices: number;

    constructor(
        { name, choices, ...rest }: ICharacterOption,
        public choiceId: string | null,
        children?: (CharacterTreeDecision | CharacterTreeEffect)[],
    ) {
        super(name, CharacterTreeNodeType.DECISION, children);

        this.numChoices = choices?.length ?? 0;
        this.nodeType = CharacterTreeNodeType.DECISION;
        Object.assign(this, rest);
    }
}

export class CharacterTreeEffect
    extends CharacterTreeChildNode
    implements ICharacterTreeEffect, GrantableEffect
{
    nodeType: CharacterTreeNodeType.EFFECT;
    children?: CharacterTreeEffect[];

    description?: string;
    hidden?: boolean;
    type: GrantableEffectType;
    image?: string;
    grants?: GrantableEffect[];
    sourceType?: CharacterPlannerStep;

    constructor(
        { name, ...rest }: GrantableEffect,
        children?: CharacterTreeEffect[],
    ) {
        super(name, CharacterTreeNodeType.EFFECT, children);

        this.nodeType = CharacterTreeNodeType.EFFECT;
        Object.assign(this, rest);
        this.type = rest.type; // make typescript happy
    }
}
