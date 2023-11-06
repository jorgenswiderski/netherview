import {
    StaticReferenceHandle,
    StaticallyReferenceable,
} from '@jorgenswiderski/tomekeeper-shared/dist/models/static-reference/types';
import { StaticReference } from '@jorgenswiderski/tomekeeper-shared/dist/models/static-reference/static-reference';
import { ActionEffectType } from '@jorgenswiderski/tomekeeper-shared/dist/types/grantable-effect';
import { ActionEffectStubConstructor } from '@jorgenswiderski/tomekeeper-shared/dist/models/static-reference/stubs';
import { IAction } from '@jorgenswiderski/tomekeeper-shared/dist/types/action';
import { CharacterTreeActionBaseEffect } from './character-tree-action-base-effect';
import { WeaveApi } from '../../../api/weave/weave';

let ref: {
    pool: Map<number, CharacterTreeActionEffect>;
    create: (id: number) => StaticReferenceHandle;
};

export class CharacterTreeActionEffect
    extends CharacterTreeActionBaseEffect
    implements StaticallyReferenceable
{
    constructor(action: IAction) {
        super(action, ActionEffectType.CLASS_ACTION);
    }

    toJSON(): StaticReferenceHandle {
        return ref.create(this.id);
    }

    static async fromId(id: number): Promise<CharacterTreeActionEffect> {
        const action = await WeaveApi.actions.getById(id);

        return new CharacterTreeActionEffect(action);
    }
}

// Assure that the constructor signature matches that defined by the class stub
// See stubs.ts for more info
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const typeCheck: ActionEffectStubConstructor = CharacterTreeActionEffect;

ref = StaticReference.registerClass(CharacterTreeActionEffect, 'a');
export const initCharacterTreeActionEffectRef = () => ref;
