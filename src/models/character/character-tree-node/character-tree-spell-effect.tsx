import {
    ActionEffectType,
    GrantableEffect,
    GrantableEffectType,
    IActionEffect,
} from 'planner-types/src/types/grantable-effect';
import { IActionBase } from 'planner-types/src/types/action';
import { CharacterTreeEffect } from './character-tree';

export class CharacterTreeActionEffect
    extends CharacterTreeEffect
    implements IActionEffect
{
    type: GrantableEffectType.ACTION = GrantableEffectType.ACTION;
    id: number;

    constructor(
        effect: GrantableEffect,
        public subtype: ActionEffectType,
        public action: IActionBase,
    ) {
        super(effect);

        this.id = action.id;
    }
}
