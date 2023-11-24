// types.ts
import { ICharacterOption } from '@jorgenswiderski/tomekeeper-shared/dist/types/character-feature-customization-option';
import { GrantableEffect } from '@jorgenswiderski/tomekeeper-shared/dist/types/grantable-effect';
import { IActionBase } from '@jorgenswiderski/tomekeeper-shared/dist/types/action';

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
    parent?: ICharacterTreeNode;
    nodeType: CharacterTreeNodeType.EFFECT;
    children?: ICharacterTreeEffect[];
}

export interface ICharacterTreeDecision
    extends ICharacterOption,
        ICharacterTreeNode {
    parent?: ICharacterTreeNode;
    nodeType: CharacterTreeNodeType.DECISION;
    choiceId: string | null;
}

export enum TraversalMethod {
    BreadthFirst,
    DepthFirst,
}

export interface ICharacterTreeAction extends ICharacterTreeDecision {
    action: IActionBase;
}
