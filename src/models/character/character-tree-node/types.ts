// types.ts
import { ICharacterOption } from 'planner-types/src/types/character-feature-customization-option';
import { GrantableEffect } from 'planner-types/src/types/grantable-effect';
import { ISpell } from 'planner-types/src/types/action';

export enum CharacterTreeNodeType {
    ROOT,
    EFFECT,
    DECISION,
}

export interface ICharacterTreeNode {
    name: string;
    children?: (ICharacterTreeDecision | ICharacterTreeEffect)[];
    // parent?: ICharacterTreeNode;
    nodeType: CharacterTreeNodeType;
}

export interface ICharacterTreeRoot extends ICharacterTreeNode {
    // parent?: undefined;
    nodeType: CharacterTreeNodeType.ROOT;
}

export interface ICharacterTreeEffect
    extends GrantableEffect,
        ICharacterTreeNode {
    // parent: ICharacterTreeNode;
    nodeType: CharacterTreeNodeType.EFFECT;
    children?: ICharacterTreeEffect[];
}

export interface ICharacterTreeDecision
    extends ICharacterOption,
        ICharacterTreeNode {
    // parent: ICharacterTreeNode;
    nodeType: CharacterTreeNodeType.DECISION;
}

export enum TraversalMethod {
    BreadthFirst,
    DepthFirst,
}

export interface ICharacterTreeSpell extends ICharacterTreeDecision {
    spell: ISpell;
}
