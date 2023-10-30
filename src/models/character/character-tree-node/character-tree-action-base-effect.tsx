import {
    ActionEffectType,
    GrantableEffectType,
    IActionEffect,
} from '@jorgenswiderski/tomekeeper-shared/dist/types/grantable-effect';
import { IActionBase } from '@jorgenswiderski/tomekeeper-shared/dist/types/action';
import { CharacterTreeEffect } from './character-tree';

export class CharacterTreeActionBaseEffect
    extends CharacterTreeEffect
    implements IActionEffect
{
    type: GrantableEffectType.ACTION = GrantableEffectType.ACTION;
    action: IActionBase;
    subtype: ActionEffectType;
    id: number;

    constructor(effect: IActionEffect) {
        super(effect);

        this.action = effect.action;
        this.subtype = effect.subtype;
        this.id = effect.id;
    }
}
