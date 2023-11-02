import {
    StaticReferenceHandle,
    StaticallyReferenceable,
} from '@jorgenswiderski/tomekeeper-shared/dist/models/static-reference/types';
import { StaticReference } from '@jorgenswiderski/tomekeeper-shared/dist/models/static-reference/static-reference';
import {
    ActionEffectType,
    GrantableEffectType,
    IActionEffect,
} from '@jorgenswiderski/tomekeeper-shared/dist/types/grantable-effect';
import { ActionEffectStubConstructor } from '@jorgenswiderski/tomekeeper-shared/dist/models/static-reference/stubs';
import { CharacterTreeActionBaseEffect } from './character-tree-action-base-effect';
import { WeaveApi } from '../../../api/weave/weave';

let ref: {
    pool: Map<number, CharacterTreeSpellEffect>;
    create: (id: number) => StaticReferenceHandle;
};

export class CharacterTreeSpellEffect
    extends CharacterTreeActionBaseEffect
    implements StaticallyReferenceable
{
    toJSON(): StaticReferenceHandle {
        return ref.create(this.id);
    }

    static async fromId(id: number): Promise<CharacterTreeSpellEffect> {
        const actionData = await WeaveApi.spells.getById(id);

        const actionEffect: IActionEffect = {
            type: GrantableEffectType.ACTION,
            subtype: ActionEffectType.SPELL_ACTION,
            action: actionData,
            name: actionData.name,
            id: actionData.id,
        };

        return new CharacterTreeSpellEffect(actionEffect);
    }
}

// Assure that the constructor signature matches that defined by the class stub
// See stubs.ts for more info
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const typeCheck: ActionEffectStubConstructor = CharacterTreeSpellEffect;

ref = StaticReference.registerClass(CharacterTreeSpellEffect, 's');
export const initCharacterTreeSpellEffectRef = () => ref;
