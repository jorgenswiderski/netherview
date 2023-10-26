import { CharacterPlannerStep } from 'planner-types/src/types/character-feature-customization-option';
import { ISpell } from 'planner-types/src/types/action';
import { ActionEffectType } from 'planner-types/src/types/grantable-effect';
import {
    StaticReferenceHandle,
    StaticallyReferenceable,
} from '../../compressor/static-reference/types';
import { StaticReference } from '../../compressor/static-reference/static-reference';
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

    static async fromId(id: number): Promise<CharacterTreeActionBase> {
        const spellData = await WeaveApi.getSpellById(id);

        return new CharacterTreeSpell(spellData);
    }
}

ref = StaticReference.registerClass(CharacterTreeSpell, 's');
