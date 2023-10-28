import { EquipmentSlot } from 'planner-types/src/types/equipment-item';
import { CharacterPlannerStep } from 'planner-types/src/types/character-feature-customization-option';
import { RecordCompressor } from 'planner-types/src/models/compressable-record/compressable-record';
import {
    CompressableRecordHandle,
    CompressableRecord,
} from 'planner-types/src/models/compressable-record/types';
import { CharacterTreeDecision, CharacterTreeEffect } from './character-tree';
import { ICharacterTreeEquipmentItem } from '../../items/types';
import { EquipmentItem } from '../../items/equipment-item';

let compress: (...args: any[]) => CompressableRecordHandle;

export class CharacterTreeEquipmentItem
    extends CharacterTreeDecision
    implements ICharacterTreeEquipmentItem, CompressableRecord
{
    constructor(
        public equipmentSlot: EquipmentSlot,
        public item: EquipmentItem,
    ) {
        const option = {
            name: item.name,
            description: item.description,
            type: CharacterPlannerStep.EQUIP_ITEM,
        };

        const children =
            item.effects.length > 0
                ? item.effects.map(
                      (effect) =>
                          new CharacterTreeEffect({
                              image: item.image,
                              ...effect,
                          }),
                  )
                : undefined;

        super(option, null, children);
    }

    toJSON() {
        return compress(this.equipmentSlot, this.item.toJSON());
    }
}

compress = RecordCompressor.registerClass(CharacterTreeEquipmentItem, 0);
