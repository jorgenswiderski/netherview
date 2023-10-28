import { IAction } from 'planner-types/src/types/action';
import { ActionEffectType } from 'planner-types/src/types/grantable-effect';
import { ActionStubConstructor } from 'planner-types/src/models/static-reference/stubs';
import {
    CompressableRecord,
    CompressableRecordHandle,
} from 'planner-types/src/models/compressable-record/types';
import { RecordCompressor } from 'planner-types/src/models/compressable-record/compressable-record';
import { CharacterTreeActionBase } from './character-tree-action-base';
import { WeaveApi } from '../../../api/weave/weave';

let compress: (id: number, choiceId: string) => CompressableRecordHandle;

export class CharacterTreeAction
    extends CharacterTreeActionBase
    implements CompressableRecord
{
    choiceId: string;

    constructor(
        public action: IAction,
        choiceId: string,
    ) {
        super(action, ActionEffectType.SPELL_ACTION, choiceId);
        this.choiceId = choiceId;
    }

    toJSON(): CompressableRecordHandle {
        return compress(this.id, this.choiceId);
    }

    static async decompress(
        id: number,
        choiceId: string,
    ): Promise<CharacterTreeAction> {
        const actionData = await WeaveApi.actions.getById(id);

        return new CharacterTreeAction(actionData, choiceId);
    }
}

// Assure that the constructor signature matches that defined by the class stub
// See stubs.ts for more info
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const typeCheck: ActionStubConstructor = CharacterTreeAction;

compress = RecordCompressor.registerClass(CharacterTreeAction, 2);
export const initCharacterTreeActionCompressor = () => compress;
