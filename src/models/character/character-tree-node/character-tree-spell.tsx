import {
    CharacterPlannerStep,
    ICharacterOption,
} from 'planner-types/src/types/character-feature-customization-option';
import { ISpell } from 'planner-types/src/types/action';
import {
    ActionEffectType,
    GrantableEffectType,
} from 'planner-types/src/types/grantable-effect';
import { CharacterTreeDecision } from './character-tree';
import {
    StaticReferenceHandle,
    StaticallyReferenceable,
} from '../../compressor/static-reference/types';
import { StaticReference } from '../../compressor/static-reference/static-reference';
import { WeaveApi } from '../../../api/weave/weave';
import { ICharacterTreeSpell } from './types';
import { CharacterTreeSpellEffect } from './character-tree-spell-effect';

let ref: {
    pool: Map<number, CharacterTreeSpell>;
    create: (id: number) => StaticReferenceHandle;
};

export class CharacterTreeSpell
    extends CharacterTreeDecision
    implements ICharacterTreeSpell, StaticallyReferenceable
{
    id: number;

    constructor(public spell: ISpell) {
        const type =
            spell.level === 0
                ? CharacterPlannerStep.LEARN_CANTRIPS
                : CharacterPlannerStep.LEARN_SPELLS;

        const option: ICharacterOption = {
            name: spell.name,
            description: spell.description,
            image: spell.image,
            type,
        };

        const grants = [
            {
                name: spell.name,
                description: spell.description,
                type: GrantableEffectType.ACTION,
                subtype: ActionEffectType.SPELL_ACTION,
                image: spell.image,
                id: spell.id,
            },
        ];

        const children = grants.map(
            (child) => new CharacterTreeSpellEffect(child, spell),
        );

        super(option, children);

        this.id = spell.id;
    }

    toJSON(): StaticReferenceHandle {
        return ref.create(this.id);
    }

    static async fromId(id: number): Promise<CharacterTreeSpell> {
        const spellData = await WeaveApi.getSpellById(id);

        return new CharacterTreeSpell(spellData);
    }
}

ref = StaticReference.registerClass(CharacterTreeSpell, 's');
