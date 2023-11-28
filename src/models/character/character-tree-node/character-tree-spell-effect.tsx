import {
    StaticReferenceHandle,
    StaticReferenceIdentifier,
    StaticallyReferenceable,
} from '@jorgenswiderski/tomekeeper-shared/dist/models/static-reference/types';
import { StaticReference } from '@jorgenswiderski/tomekeeper-shared/dist/models/static-reference/static-reference';
import { ActionEffectType } from '@jorgenswiderski/tomekeeper-shared/dist/types/grantable-effect';
import { SpellEffectStubConstructor } from '@jorgenswiderski/tomekeeper-shared/dist/models/static-reference/stubs';
import { ISpell } from '@jorgenswiderski/tomekeeper-shared/dist/types/action';
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
    constructor(action: ISpell) {
        super(action, ActionEffectType.SPELL_ACTION);
    }

    toJSON(): StaticReferenceHandle {
        return ref.create(this.id);
    }

    static async fromId(id: number): Promise<CharacterTreeSpellEffect> {
        const spell = await WeaveApi.spells.getById(id);

        return new CharacterTreeSpellEffect(spell);
    }
}

// Assure that the constructor signature matches that defined by the class stub
// See stubs.ts for more info
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const typeCheck: SpellEffectStubConstructor = CharacterTreeSpellEffect;

ref = StaticReference.registerClass(
    CharacterTreeSpellEffect,
    StaticReferenceIdentifier.Spell,
);

export const initCharacterTreeSpellEffectRef = () => ref;
