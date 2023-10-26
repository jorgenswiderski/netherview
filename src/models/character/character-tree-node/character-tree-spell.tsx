import { CharacterPlannerStep } from 'planner-types/src/types/character-feature-customization-option';
import { ISpell } from 'planner-types/src/types/action';
import { ActionEffectType } from 'planner-types/src/types/grantable-effect';
import {
    StaticReferenceHandle,
    StaticallyReferenceable,
} from 'planner-types/src/models/static-reference/types';
import { StaticReference } from 'planner-types/src/models/static-reference/static-reference';
import { SpellStubConstructor } from 'planner-types/src/models/static-reference/stubs';
import { WeaveApi } from '../../../api/weave/weave';
import { CharacterTreeActionBase } from './character-tree-action-base';

let ref: {
    pool: Map<number, CharacterTreeActionBase>;
    create: (id: number) => StaticReferenceHandle;
};

export class CharacterTreeSpell
    extends CharacterTreeActionBase
    implements StaticallyReferenceable
{
    constructor(public action: ISpell) {
        const type =
            action.level === 0
                ? CharacterPlannerStep.LEARN_CANTRIPS
                : CharacterPlannerStep.LEARN_SPELLS;

        super(action, ActionEffectType.SPELL_ACTION, type);
    }

    toJSON(): StaticReferenceHandle {
        return ref.create(this.id);
    }

    static async fromId(id: number): Promise<CharacterTreeSpell> {
        const spellData = await WeaveApi.spells.getById(id);

        return new CharacterTreeSpell(spellData);
    }
}

// Assure that the constructor signature matches that defined by the class stub
// See stubs.ts for more info
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const typeCheck: SpellStubConstructor = CharacterTreeSpell;

ref = StaticReference.registerClass(CharacterTreeSpell, 's2'); // unused
