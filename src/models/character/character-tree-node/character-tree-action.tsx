import { IAction } from 'planner-types/src/types/action';
import { ActionEffectType } from 'planner-types/src/types/grantable-effect';
import { StaticReference } from 'planner-types/src/models/static-reference/static-reference';
import {
    StaticReferenceHandle,
    StaticallyReferenceable,
} from 'planner-types/src/models/static-reference/types';
import { ActionStubConstructor } from 'planner-types/src/models/static-reference/stubs';
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

// Assure that the constructor signature matches that defined by the class stub
// See stubs.ts for more info
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const typeCheck: ActionStubConstructor = CharacterTreeAction;

ref = StaticReference.registerClass(CharacterTreeAction, 'a2'); // unused
