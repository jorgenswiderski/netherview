import {
    CharacterPlannerStep,
    ICharacterOption,
} from 'planner-types/src/types/character-feature-customization-option';
import { IActionBase } from 'planner-types/src/types/action';
import {
    ActionEffectType,
    GrantableEffectType,
    IActionEffect,
} from 'planner-types/src/types/grantable-effect';
import { CharacterTreeDecision } from './character-tree';
import { ICharacterTreeAction } from './types';
import { CharacterTreeActionBaseEffect } from './character-tree-action-base-effect';

export class CharacterTreeActionBase
    extends CharacterTreeDecision
    implements ICharacterTreeAction
{
    id: number;

    constructor(
        public action: IActionBase,
        subtype: ActionEffectType,
        type?: CharacterPlannerStep,
    ) {
        const option: ICharacterOption = {
            name: action.name,
            description: action.description,
            image: action.image,
            type,
        };

        const grants: IActionEffect[] = [
            {
                name: action.name,
                description: action.description,
                type: GrantableEffectType.ACTION,
                subtype,
                image: action.image,
                id: action.id,
                action,
            },
        ];

        const children = grants.map(
            (child) => new CharacterTreeActionBaseEffect(child),
        );

        super(option, children);

        this.id = action.id;
    }
}
