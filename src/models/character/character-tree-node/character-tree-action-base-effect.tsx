import {
    ActionEffectType,
    GrantableEffectType,
    IActionEffect,
} from '@jorgenswiderski/tomekeeper-shared/dist/types/grantable-effect';
import {
    IAction,
    IActionBase,
} from '@jorgenswiderski/tomekeeper-shared/dist/types/action';
import { CharacterTreeEffect } from './character-tree';

export class CharacterTreeActionBaseEffect
    extends CharacterTreeEffect
    implements IActionEffect
{
    type: GrantableEffectType.ACTION = GrantableEffectType.ACTION;
    action: IActionBase;
    subtype: ActionEffectType;
    id: number;

    constructor(action: IAction, subtype: ActionEffectType) {
        const effect: IActionEffect = {
            type: GrantableEffectType.ACTION,
            subtype,
            action,
            name: action.name,
            id: action.id,
        };

        super(effect);

        this.action = action;
        this.subtype = subtype;
        this.id = action.id;
    }
}
