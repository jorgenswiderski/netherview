import { CharacterPlannerStep } from 'planner-types/src/types/character-feature-customization-option';
import { ISpell } from 'planner-types/src/types/action';
import { ActionEffectType } from 'planner-types/src/types/grantable-effect';
import { SpellStubConstructor } from 'planner-types/src/models/static-reference/stubs';
import {
    CompressableRecord,
    CompressableRecordHandle,
} from 'planner-types/src/models/compressable-record/types';
import { RecordCompressor } from 'planner-types/src/models/compressable-record/compressable-record';
import { CharacterTreeActionBase } from './character-tree-action-base';
import { WeaveApi } from '../../../api/weave/weave';

let compress: (id: number, choiceId: string) => CompressableRecordHandle;

export class CharacterTreeSpell
    extends CharacterTreeActionBase
    implements CompressableRecord
{
    choiceId: string;

    constructor(
        public action: ISpell,
        choiceId: string,
    ) {
        const type =
            action.level === 0
                ? CharacterPlannerStep.LEARN_CANTRIPS
                : CharacterPlannerStep.LEARN_SPELLS;

        super(action, ActionEffectType.SPELL_ACTION, choiceId, type);
        this.choiceId = choiceId;
    }

    toJSON(): CompressableRecordHandle {
        return compress(this.id, this.choiceId);
    }

    static async decompress(
        id: number,
        choiceId: string,
    ): Promise<CharacterTreeSpell> {
        const spellData = await WeaveApi.spells.getById(id);

        return new CharacterTreeSpell(spellData, choiceId);
    }
}

// Assure that the constructor signature matches that defined by the class stub
// See stubs.ts for more info
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const typeCheck: SpellStubConstructor = CharacterTreeSpell;

compress = RecordCompressor.registerClass(CharacterTreeSpell, 1);
