import {
    ActionEffectType,
    GrantableEffect,
    GrantableEffectType,
    IActionEffect,
} from 'planner-types/src/types/grantable-effect';
import { ISpell } from 'planner-types/src/types/action';
import { CharacterTreeEffect } from './character-tree';

export class CharacterTreeSpellEffect
    extends CharacterTreeEffect
    implements IActionEffect
{
    type: GrantableEffectType.ACTION = GrantableEffectType.ACTION;
    subtype: ActionEffectType = ActionEffectType.SPELL_ACTION;
    id: number;

    constructor(
        effect: GrantableEffect,
        public action: ISpell,
    ) {
        super(effect);

        this.id = action.id;
    }
}
