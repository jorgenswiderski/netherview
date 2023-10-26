import { IAction } from 'planner-types/src/types/action';
import { ActionEffectType } from 'planner-types/src/types/grantable-effect';
import {
    StaticReferenceHandle,
    StaticallyReferenceable,
} from '../../compressor/static-reference/types';
import { StaticReference } from '../../compressor/static-reference/static-reference';
import { WeaveApi } from '../../../api/weave/weave';
import { CharacterTreeActionBase } from './character-tree-action-base';

let ref: {
    pool: Map<number, CharacterTreeAction>;
    create: (id: number) => StaticReferenceHandle;
};

export class CharacterTreeAction
    extends CharacterTreeActionBase
    implements StaticallyReferenceable
{
    constructor(public action: IAction) {
        super(action, ActionEffectType.CLASS_ACTION);
    }

    toJSON(): StaticReferenceHandle {
        return ref.create(this.id);
    }

    static async fromId(id: number): Promise<CharacterTreeAction> {
        const actionData = await WeaveApi.getActionById(id);

        return new CharacterTreeAction(actionData);
    }
}

ref = StaticReference.registerClass(CharacterTreeAction, 'a');
