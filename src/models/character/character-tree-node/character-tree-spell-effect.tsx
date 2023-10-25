import { GrantableEffect } from 'planner-types/src/types/grantable-effect';
import { ISpell } from 'planner-types/src/types/spell';
import { CharacterTreeEffect } from './character-tree';

export class CharacterTreeSpellEffect extends CharacterTreeEffect {
    constructor(
        effect: GrantableEffect,
        public spell: ISpell,
    ) {
        super(effect);
    }
}
